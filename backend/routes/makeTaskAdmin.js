const { Users } = require("../models/users");
const express = require("express");
const router = express.Router();
const authorizeUser = require("../middleware/auth");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const commentHandler = require("../middleware/commentHandler");
const Joi = require("joi");
const { singleMemberNotifier } = require("./assignMemberForSubtask");
Joi.objectId = require("joi-objectid")(Joi);

router.put(
  "/",
  authorizeUser,
  commentHandler,
  asyncErrorHandler(async (req, res) => {
    const { error } = validateUserForAdmin(req.body);
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }

    const userToBeAdminCheck = await Users.findById(req.body?.userToBeAdminID);

    if (!userToBeAdminCheck)
      return res
        .status(404)
        .json({ msg: "User you're trying to make an admin doesn't exist" });

    const currentUser = await Users.findById(req.user._id);

    if (!currentUser) return res.status(404).json({ msg: "User not found!" });
    const currentUserName = currentUser?.name;

    const userWithTheTask = await Users.findById(req.commentInfo._id);
    const userWithTaskName = userWithTheTask?.name;

    let commonUser =
      userWithTaskName !== currentUserName ? userWithTheTask : currentUser;

    const task = commonUser.tasks.id(req.body.taskID);
    const userToBeAdmin = task.memberList.members.id(req.body?.userToBeAdminID);

    if (!userToBeAdmin)
      return res.status(404).json({
        msg: "User you're trying to make an admin doesn't exist in your task group",
      });

    // Make the desired user the admin of the particular task
    userToBeAdmin.isTaskAdmin = true;
    await commonUser.save();
    res.status(200).json({
      msg: "Updated the admin status successfully!",
    });
    await singleMemberNotifier({
      concernedMember: userToBeAdminCheck,
      notifMessage: `You're now an admin for the task activity: <span class=colored>${task.taskName}</span>`,
    });
  })
);

const validateUserForAdmin = (incomingReq) => {
  const schema = Joi.object({
    userToBeAdminID: Joi.objectId().required(),
    taskID: Joi.objectId().required(),
    referralTaskID: Joi.string().required(),
  });
  return schema.validate(incomingReq);
};

module.exports = router;
