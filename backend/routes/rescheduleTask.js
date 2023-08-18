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

const reschedulingFunc = (requestObject, taskToBeRescheduled) => {
  taskToBeRescheduled.taskStartDate = requestObject.taskStartDate
    ? requestObject.taskStartDate
    : taskToBeRescheduled.taskStartDate;
};

router.put(
  "/",
  authorizeUser,
  asyncErrorHandler(async (req, res) => {
    const { error } = validateReschedule(req.body);
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

      const taskToBeRescheduled = commonUser.tasks.id(req.body.id);
      if (!taskToBeRescheduled)
        return res
          .status(404)
          .json({ msg: "Task doesn't exist, please try again!" });

      reschedulingFunc(req.body, taskToBeRescheduled);

      await commonUser.save();
      res.status(200).json({ msg: "Task Rescheduled Successfully!" });

      await memberNotifier({
        concernedTaskMembers: taskToBeRescheduled?.memberList?.members?.filter(
          (mem) => mem.name !== currentUser.name
        ),
        notifMessage: `Task Activity Rescheduled: The task activity <span class=colored>${taskToBeRescheduled.taskName}</span> has been rescheduled to a new date: <span class=colored>${req.body?.taskStartDate}</span>`,
      });

      return;
    }
    const taskToBeRescheduled = currentUser.tasks.id(req.body.id);
    if (!taskToBeRescheduled)
      return res
        .status(404)
        .json({ msg: "Task doesn't exist, please try again!" });

    reschedulingFunc(req.body, taskToBeRescheduled);

    await currentUser.save();
    res.status(200).json({ msg: "Task Rescheduled Successfully!" });
  })
);

const validateReschedule = (incomingRescheduleReq) => {
  const schema = Joi.object({
    id: Joi.objectId().required(),
    referralTaskID: Joi.string(),
    taskStartDate: Joi.string().required(),
  });
  return schema.validate(incomingRescheduleReq);
};

module.exports = router;
