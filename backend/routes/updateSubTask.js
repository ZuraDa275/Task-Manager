const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const { Users } = require("../models/users");
const authorizeUser = require("../middleware/auth");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const express = require("express");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { singleMemberNotifier } = require("./assignMemberForSubtask");
const router = express.Router();

const subTaskUpdateFunc = (requestObject, subTaskToBeUpdated) => {
  subTaskToBeUpdated.taskName = requestObject.taskName
    ? requestObject.taskName
    : subTaskToBeUpdated.taskName;
  subTaskToBeUpdated.taskDescription = requestObject.taskDescription
    ? requestObject.taskDescription
    : subTaskToBeUpdated.taskDescription;
};

router.put(
  "/",
  authorizeUser,
  asyncErrorHandler(async (req, res) => {
    const { error } = validateSubTaskUpdate(req.body);
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

      const taskInWhichSubtaskIsGoingToBeUpdated = commonUser.tasks.id(
        req.body.taskID
      );
      if (!taskInWhichSubtaskIsGoingToBeUpdated)
        return res
          .status(404)
          .json({ msg: "Task doesn't exist, please try again!" });

      const subTaskToBeUpdated =
        taskInWhichSubtaskIsGoingToBeUpdated.subtasks.id(req.body.subTaskID);

      if (!subTaskToBeUpdated)
        return res
          .status(404)
          .json({ msg: "SubTask couldn't be found, please try again!" });

      const subtaskDeepCopy = JSON.parse(JSON.stringify(subTaskToBeUpdated));

      subTaskUpdateFunc(req.body, subTaskToBeUpdated);
      await commonUser.save();
      res.status(200).json({ msg: "Subtask updated successfully!" });

      if (
        subtaskDeepCopy.hasOwnProperty("assignedMember") &&
        subtaskDeepCopy.assignedMember.name !== currentUser.name &&
        req.body.taskName !== subtaskDeepCopy.taskName
      ) {
        const assignedMemberToBeNotified = await Users.findById(
          subtaskDeepCopy.assignedMember._id
        );
        await singleMemberNotifier({
          concernedMember: assignedMemberToBeNotified,
          notifMessage: `The title of the subtask you're assigned to has been updated: <span class=colored>${subtaskDeepCopy.taskName}</span> → <span class=colored>${req.body.taskName}</span>`,
        });
      }
      return;
    }
    const taskInWhichSubtaskIsGoingToBeUpdated = currentUser.tasks.id(
      req.body.taskID
    );
    if (!taskInWhichSubtaskIsGoingToBeUpdated)
      return res
        .status(404)
        .json({ msg: "Task doesn't exist, please try again!" });

    const subTaskToBeUpdated = taskInWhichSubtaskIsGoingToBeUpdated.subtasks.id(
      req.body.subTaskID
    );

    if (!subTaskToBeUpdated)
      return res
        .status(404)
        .json({ msg: "SubTask couldn't be found, please try again!" });

    subTaskUpdateFunc(req.body, subTaskToBeUpdated);
    await currentUser.save();
    res.status(200).json({ msg: "Subtask updated successfully!" });
  })
);

const validateSubTaskUpdate = (incomingSubTaskUpdate) => {
  const schema = Joi.object({
    taskID: Joi.objectId().required(),
    referralTaskID: Joi.string(),
    subTaskID: Joi.objectId().required(),
    taskName: Joi.string().min(3).max(15).allow(""),
    taskDescription: Joi.string().min(5).max(100).allow(""),
  });
  return schema.validate(incomingSubTaskUpdate);
};

module.exports = router;
