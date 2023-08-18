const { Users } = require("../models/users");
const express = require("express");
const router = express.Router();
const authorizeUser = require("../middleware/auth");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const commentHandler = require("../middleware/commentHandler");
const { singleMemberNotifier } = require("./assignMemberForSubtask");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

router.put(
  "/",
  authorizeUser,
  commentHandler,
  asyncErrorHandler(async (req, res) => {
    const { error } = validateUserForDismissal(req.body);
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }

    const userToBeDismissedCheck = await Users.findById(
      req.body?.userToBeDismissedID
    );

    if (!userToBeDismissedCheck)
      return res.status(404).json({
        msg: "User you're trying to dismiss as an admin doesn't exist",
      });

    const currentUser = await Users.findById(req.user._id);

    if (!currentUser) return res.status(404).json({ msg: "User not found!" });
    const currentUserName = currentUser?.name;

    const userWithTheTask = await Users.findById(req.commentInfo._id);
    const userWithTaskName = userWithTheTask?.name;

    if (userWithTaskName === userToBeDismissedCheck.name) {
      return res.status(401).json({
        msg: `Can't dismiss ${userWithTaskName}, as they are the creator of this group`,
      });
    }

    let commonUser =
      userWithTaskName !== currentUserName ? userWithTheTask : currentUser;

    const task = commonUser.tasks.id(req.body.taskID);
    const userToBeDismissed = task.memberList.members.id(
      req.body?.userToBeDismissedID
    );

    if (!userToBeDismissed)
      return res.status(404).json({
        msg: "User you're trying to dismiss as an admin doesn't exist in your task group",
      });

    // Dismiss the desired admin of the particular task
    userToBeDismissed.isTaskAdmin = false;
    await commonUser.save();
    res.status(200).json({
      msg: "Dismissed the admin successfully!",
    });
    await singleMemberNotifier({
      concernedMember: userToBeDismissedCheck,
      notifMessage: `You're no longer an admin for the task activity: <span class=colored>${task.taskName}</span>`,
    });
  })
);

const validateUserForDismissal = (incomingReq) => {
  const schema = Joi.object({
    userToBeDismissedID: Joi.objectId().required(),
    taskID: Joi.objectId().required(),
    referralTaskID: Joi.string().required(),
  });
  return schema.validate(incomingReq);
};

module.exports = router;
