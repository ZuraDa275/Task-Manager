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

const taskUpdateFunc = (requestObject, taskToBeUpdated) => {
  taskToBeUpdated.taskName = requestObject.taskName
    ? requestObject.taskName
    : taskToBeUpdated.taskName;

  taskToBeUpdated.taskDescription = requestObject.taskDescription
    ? requestObject.taskDescription
    : taskToBeUpdated.taskDescription;

  taskToBeUpdated.taskStartDate = requestObject.taskStartDate
    ? requestObject.taskStartDate
    : taskToBeUpdated.taskStartDate;

  taskToBeUpdated.taskStartTime = requestObject.taskStartTime
    ? requestObject.taskStartTime
    : taskToBeUpdated.taskStartTime;

  taskToBeUpdated.priority = requestObject.priority
    ? requestObject.priority
    : taskToBeUpdated.priority;
};

router.put(
  "/",
  authorizeUser,
  asyncErrorHandler(async (req, res) => {
    const { error } = validateUpdate(req.body);
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
      const oldtaskTitle = taskToBeUpdated.taskName;

      taskUpdateFunc(req.body, taskToBeUpdated);

      await commonUser.save();
      res.status(200).json({ msg: "Task Updated Successfully!" });
      if (req.body.taskName && req.body.taskName !== oldtaskTitle) {
        await memberNotifier({
          concernedTaskMembers: taskToBeUpdated?.memberList?.members?.filter(
            (mem) => mem.name !== currentUser.name
          ),
          notifMessage: `The title of the task activity you're a part of has been updated: <span class=colored>${oldtaskTitle}</span> → <span class=colored>${req.body.taskName}</span>`,
        });
      }
      return;
    }
    const taskToBeUpdated = currentUser.tasks.id(req.body.id);
    if (!taskToBeUpdated)
      return res
        .status(404)
        .json({ msg: "Task doesn't exist, please try again!" });

    taskUpdateFunc(req.body, taskToBeUpdated);

    await currentUser.save();
    res.status(200).json({ msg: "Task Updated Successfully!" });
  })
);

const validateUpdate = (incomingUpdate) => {
  const schema = Joi.object({
    id: Joi.objectId().required(),
    referralTaskID: Joi.string(),
    taskName: Joi.string().min(3).max(15).allow(""),
    taskDescription: Joi.string().min(5).max(200).allow(""),
    taskStartDate: Joi.string().allow(""),
    taskStartTime: Joi.string().allow(""),
    priority: Joi.string().valid("Low", "Medium", "High").allow(""),
  });
  return schema.validate(incomingUpdate);
};

module.exports = router;
