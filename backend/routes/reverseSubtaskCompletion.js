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
    const { error } = validateSubTaskIncompletionReq(req.body);
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

      const taskInWhichSubtaskIsGoingToBeCompleted = commonUser.tasks.id(
        req.body.taskID
      );
      if (!taskInWhichSubtaskIsGoingToBeCompleted)
        return res
          .status(404)
          .json({ msg: "Task doesn't exist, please try again!" });

      const subTaskToBeCompleted =
        taskInWhichSubtaskIsGoingToBeCompleted.subtasks.id(req.body.subTaskID);

      if (!subTaskToBeCompleted)
        return res
          .status(404)
          .json({ msg: "SubTask couldn't be found, please try again!" });

      subTaskToBeCompleted.isCompleted = false;

      await commonUser.save();
      res.status(200).json({ msg: "Undid subtask completion" });

      await memberNotifier({
        concernedTaskMembers:
          taskInWhichSubtaskIsGoingToBeCompleted?.memberList?.members?.filter(
            (mem) => mem.name !== currentUser.name
          ),
        notifMessage: `Correction: The subtask <span class=colored>${subTaskToBeCompleted.taskName}</span> of the task activity <span class=colored>${taskInWhichSubtaskIsGoingToBeCompleted.taskName}</span> is still ongoing. It was mistakenly marked as completed. Keep up the good work!`,
      });
      return;
    }
    const taskInWhichSubtaskIsGoingToBeCompleted = currentUser.tasks.id(
      req.body.taskID
    );
    if (!taskInWhichSubtaskIsGoingToBeCompleted)
      return res
        .status(404)
        .json({ msg: "Task doesn't exist, please try again!" });

    const subTaskToBeCompleted =
      taskInWhichSubtaskIsGoingToBeCompleted.subtasks.id(req.body.subTaskID);

    if (!subTaskToBeCompleted)
      return res
        .status(404)
        .json({ msg: "SubTask couldn't be found, please try again!" });

    subTaskToBeCompleted.isCompleted = false;

    await currentUser.save();
    res.status(200).json({ msg: "Undid subtask completion" });
  })
);

const validateSubTaskIncompletionReq = (incomingSubTaskIncompletionReq) => {
  const schema = Joi.object({
    taskID: Joi.objectId().required(),
    referralTaskID: Joi.string(),
    subTaskID: Joi.objectId().required(),
  });
  return schema.validate(incomingSubTaskIncompletionReq);
};
module.exports = router;
