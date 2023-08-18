const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const { Users } = require("../models/users");
const authorizeUser = require("../middleware/auth");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const express = require("express");
const commentHandler = require("../middleware/commentHandler");
const { singleMemberNotifier } = require("./assignMemberForSubtask");
const router = express.Router();

router.put(
  "/",
  authorizeUser,
  commentHandler,
  asyncErrorHandler(async (req, res) => {
    const { error } = validateRemovalRequestForAssignedMember(req.body);
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }

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

    const taskInWhichSubtaskAssignedWithMemberIsGoingToBeRemoved =
      commonUser.tasks.id(req.body.taskID);
    if (!taskInWhichSubtaskAssignedWithMemberIsGoingToBeRemoved)
      return res
        .status(404)
        .json({ msg: "Task doesn't exist, please try again!" });

    const subTaskForWhichAssignedMemberIsGoingToBeRemoved =
      taskInWhichSubtaskAssignedWithMemberIsGoingToBeRemoved.subtasks.id(
        req.body.subTaskID
      );

    if (!subTaskForWhichAssignedMemberIsGoingToBeRemoved)
      return res
        .status(404)
        .json({ msg: "SubTask couldn't be found, please try again!" });

    const memberToBeRemovedFromAssignedRole = await Users.findById(
      subTaskForWhichAssignedMemberIsGoingToBeRemoved.assignedMember._id
    );

    subTaskForWhichAssignedMemberIsGoingToBeRemoved.assignedMember = undefined;

    await commonUser.save();
    res.status(200).json({ msg: "Assigned member removed successfully!" });

    if (memberToBeRemovedFromAssignedRole.name !== currentUser.name) {
      await singleMemberNotifier({
        concernedMember: memberToBeRemovedFromAssignedRole,
        notifMessage: `You're no longer assigned to the subtask: <span class=colored>${subTaskForWhichAssignedMemberIsGoingToBeRemoved.taskName}</span>`,
      });
    }
  })
);

const validateRemovalRequestForAssignedMember = (incomingMember) => {
  const schema = Joi.object({
    taskID: Joi.objectId().required(),
    subTaskID: Joi.objectId().required(),
    referralTaskID: Joi.string(),
  });
  return schema.validate(incomingMember);
};

module.exports = router;
