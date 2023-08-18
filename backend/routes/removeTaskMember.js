const { Users } = require("../models/users");
const authorizeUser = require("../middleware/auth");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const express = require("express");
const router = express.Router();
const Joi = require("joi");
const commentHandler = require("../middleware/commentHandler");
const { singleMemberNotifier } = require("./assignMemberForSubtask");
Joi.objectId = require("joi-objectid")(Joi);

router.put(
  "/",
  authorizeUser,
  commentHandler,
  asyncErrorHandler(async (req, res) => {
    const { error } = validateMemberRemoval(req.body);
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }

    const userToBeRemoved = await Users.findById(req.body?.userToBeRemovedID);
    if (!userToBeRemoved)
      return res
        .status(404)
        .json({ msg: "User you're trying to remove doesn't exist" });

    const currentUser = await Users.findById(req.user._id);
    if (!currentUser) return res.status(404).json({ msg: "User not found!" });
    const currentUserName = currentUser?.name;

    const userWithTheTask = await Users.findById(req.commentInfo._id);
    const userWithTaskName = userWithTheTask?.name;

    if (userWithTaskName === userToBeRemoved.name) {
      return res.status(401).json({
        msg: `Can't remove ${userWithTaskName}, as they are the creator of this group`,
      });
    }

    let commonUser =
      userWithTaskName !== currentUserName ? userWithTheTask : currentUser;

    const taskToRemoveUserFrom = commonUser.tasks.id(req.body.taskID);
    const memberIndex = taskToRemoveUserFrom?.memberList?.members?.findIndex(
      (mem) => mem?.name === userToBeRemoved?.name
    );
    taskToRemoveUserFrom?.memberList?.members?.splice(memberIndex, 1);
    await commonUser.save();

    const taskToBeRemovedIndex = userToBeRemoved.tasks.findIndex(
      (task) => task.referralTaskID === req.body.referralTaskID
    );
    userToBeRemoved.tasks.splice(taskToBeRemovedIndex, 1);
    await userToBeRemoved.save();

    res.status(200).json({
      msg: "Removed the user successfully",
    });
    await singleMemberNotifier({
      concernedMember: userToBeRemoved,
      notifMessage: `You've been removed from the task activity: <span class=colored>${taskToRemoveUserFrom.taskName}</span>`,
    });
  })
);

const validateMemberRemoval = (incomingReq) => {
  const schema = Joi.object({
    userToBeRemovedID: Joi.objectId().required(),
    taskID: Joi.objectId().required(),
    referralTaskID: Joi.string().required(),
  });
  return schema.validate(incomingReq);
};

module.exports = router;
