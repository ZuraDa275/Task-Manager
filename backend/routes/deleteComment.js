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
    const { error } = validateCommentDelete(req.body);
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

    const task = commonUser.tasks.id(req.body?.taskID);
    const index = task.comments.findIndex(
      (com) => com.creationTime === req.body?.commentCreationTime
    );
    task.comments.splice(index, 1);
    await commonUser.save();
    res.status(200).json({
      msg: "Comment deleted successfully!",
    });
  })
);

const validateCommentDelete = (incomingComment) => {
  const schema = Joi.object({
    taskID: Joi.objectId().required(),
    referralTaskID: Joi.string().required(),
    commentCreationTime: Joi.number().required(),
  });
  return schema.validate(incomingComment);
};
module.exports = router;
