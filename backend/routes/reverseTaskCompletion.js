const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const { Users } = require("../models/users");
const authorizeUser = require("../middleware/auth");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const express = require("express");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { memberNotifier } = require("./addComments");
const router = express.Router();

router.put(
  "/",
  authorizeUser,
  asyncErrorHandler(async (req, res) => {
    const { error } = validateIncompleteReq(req.body);
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }

    const currentUser = await Users.findById(req.user._id);
    if (!currentUser) return res.status(404).json({ msg: "User not found!" });
    const currentUserName = currentUser.name;

    if (req.body?.referralTaskID) {
      const decoded = jwt.verify(
        req.body?.referralTaskID,
        process.env.TASK_REFERRAL
      );
      const userWithTask = await Users.findById(decoded._id);
      if (!userWithTask)
        return res.status(404).json({
          msg: "The creator of this task doesn't exist",
        });
      const userWithTaskName = userWithTask?.name;

      const commonUser =
        userWithTaskName !== currentUserName ? userWithTask : currentUser;

      const taskToBeUpdated = commonUser.tasks.id(req.body.id);
      if (!taskToBeUpdated)
        return res
          .status(404)
          .json({ msg: "Task doesn't exist, please try again!" });

      taskToBeUpdated.isCompleted = false;

      await commonUser.save();
      res.status(200).json({
        msg: "Undid the task completion",
      });

      await memberNotifier({
        concernedTaskMembers: taskToBeUpdated?.memberList?.members?.filter(
          (mem) => mem.name !== currentUser.name
        ),
        notifMessage: `Correction: The task activity <span class=colored>${taskToBeUpdated.taskName}</span> is still ongoing. It was mistakenly marked as completed. Keep up the good work!`,
      });
      return;
    }

    const taskToBeUpdated = currentUser.tasks.id(req.body.id);
    if (!taskToBeUpdated)
      return res
        .status(404)
        .json({ msg: "Task doesn't exist, please try again!" });

    taskToBeUpdated.isCompleted = false;

    await currentUser.save();
    res.status(200).json({
      msg: "Undid the task completion",
    });
  })
);

const validateIncompleteReq = (incomingTask) => {
  const schema = Joi.object({
    id: Joi.objectId().required(),
    referralTaskID: Joi.string(),
  });
  return schema.validate(incomingTask);
};

module.exports = router;
