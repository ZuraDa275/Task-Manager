const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const { Users } = require("../models/users");
const authorizeUser = require("../middleware/auth");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const express = require("express");
const commentHandler = require("../middleware/commentHandler");
const router = express.Router();

router.put(
  "/",
  authorizeUser,
  commentHandler,
  asyncErrorHandler(async (req, res) => {
    const { error } = validateIncomingAssignedMember(req.body);
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }
    const assignedMember = await Users.findById(req.body.assignedMember._id);
    if (!assignedMember)
      return res.status(404).json({
        msg: "Member you're trying to assign to the subtask doesn't exist",
      });

    const currentUser = await Users.findById(req.user._id);

    if (!currentUser) return res.status(404).json({ msg: "User not found!" });
    const currentUserName = currentUser?.name;

    const userWithTask = await Users.findById(req.commentInfo._id);

    if (!userWithTask)
      return res.status(404).json({
        msg: "The creator of this task doesn't exist",
      });

    const userWithTaskName = userWithTask?.name;

    const commonUser =
      userWithTaskName !== currentUserName ? userWithTask : currentUser;

    const taskInWhichSubtaskIsGoingToBeAssignedWithMember = commonUser.tasks.id(
      req.body.taskID
    );
    if (!taskInWhichSubtaskIsGoingToBeAssignedWithMember)
      return res
        .status(404)
        .json({ msg: "Task doesn't exist, please try again!" });

    const subTaskToBeAssignedMember =
      taskInWhichSubtaskIsGoingToBeAssignedWithMember.subtasks.id(
        req.body.subTaskID
      );

    if (!subTaskToBeAssignedMember)
      return res
        .status(404)
        .json({ msg: "SubTask couldn't be found, please try again!" });

    if (
      subTaskToBeAssignedMember.hasOwnProperty("assignedMember") &&
      Object.keys(subTaskToBeAssignedMember.assignedMember).length > 0
    ) {
      return res
        .status(401)
        .json({ msg: "A member is already been assigned to the subtask!" });
    }
    subTaskToBeAssignedMember.assignedMember = req.body.assignedMember;
    await commonUser.save();
    res.status(200).json({ msg: "Member assigned successfully!" });

    if (assignedMember.name !== currentUser.name) {
      await singleMemberNotifier({
        concernedMember: assignedMember,
        notifMessage: `You've been assigned to the subtask: <span class=colored>${subTaskToBeAssignedMember.taskName}</span>`,
      });
    }
  })
);

const validateIncomingAssignedMember = (incomingMember) => {
  const schema = Joi.object({
    taskID: Joi.objectId().required(),
    subTaskID: Joi.objectId().required(),
    referralTaskID: Joi.string(),
    assignedMember: Joi.object({
      _id: Joi.objectId().required(),
      name: Joi.string().required(),
    }),
  });
  return schema.validate(incomingMember);
};

const singleMemberNotifier = async ({ concernedMember, notifMessage }) => {
  concernedMember.notifications.unshift({
    notifMessage,
    createdAt: new Date().getTime(),
    tag: "Task Updates",
  });
  await concernedMember.save();
};
module.exports = {
  assignMemberForSubtask: router,
  singleMemberNotifier,
};
