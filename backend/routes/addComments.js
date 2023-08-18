const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const { Users } = require("../models/users");
const authorizeUser = require("../middleware/auth");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const commentHandler = require("../middleware/commentHandler");
const express = require("express");
const router = express.Router();

router.put(
  "/",
  authorizeUser,
  commentHandler,
  asyncErrorHandler(async (req, res) => {
    const { error } = validateComment(req.body);
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }

    const currentUser = await Users.findById(req.user._id);

    if (!currentUser) return res.status(404).json({ msg: "User not found!" });
    const currentUserName = currentUser?.name;

    const userWithTheTask = await Users.findById(req.commentInfo._id);
    const userWithTaskName = userWithTheTask?.name;

    let commonUser =
      userWithTaskName !== currentUserName ? userWithTheTask : currentUser;

    const taskInWhichCommentIsToBeAdded = commonUser.tasks.id(req.body.taskID);
    taskInWhichCommentIsToBeAdded.comments.push(req.body?.comments);
    await commonUser.save();
    res.status(200).json({
      msg: "Comment added Successfully",
    });
    await memberNotifier({
      concernedTaskMembers:
        taskInWhichCommentIsToBeAdded?.memberList?.members?.filter(
          (mem) => mem.name !== req.body?.comments?.name
        ),
      notifMessage: `🗣️ <span class=colored>${req.body?.comments?.name}</span> commented on the task activity you're involved in: <span class=colored>
          ${taskInWhichCommentIsToBeAdded.taskName}
        </span>`,
    });
  })
);

const validateComment = (incomingComment) => {
  const schema = Joi.object({
    taskID: Joi.objectId().required(),
    referralTaskID: Joi.string(),
    comments: Joi.object({
      name: Joi.string().required(),
      comment: Joi.string().max(150).required(),
      creationTime: Joi.number().required(),
    }),
  });
  return schema.validate(incomingComment);
};

const memberNotifier = async ({ concernedTaskMembers, notifMessage }) => {
  let taskMember = "";
  for (const member of concernedTaskMembers) {
    taskMember = await Users.findById(member._id);
    taskMember?.notifications?.unshift({
      notifMessage,
      createdAt: new Date().getTime(),
      tag: "Task Updates",
    });
    await taskMember.save();
    taskMember = "";
  }
};
module.exports = {
  addComment: router,
  memberNotifier,
};
