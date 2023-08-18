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
    const { error } = validateCommentUpdate(req.body);
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
    const commentToBeUpdated = task.comments.find(
      (com) => com?.creationTime === req.body?.commentCreationTime
    );
    commentToBeUpdated.comment = req.body?.comment;

    await commonUser.save();
    res.status(200).json({
      msg: "Comment updated Successfully",
    });
  })
);

const validateCommentUpdate = (incomingComment) => {
  const schema = Joi.object({
    taskID: Joi.objectId().required(),
    referralTaskID: Joi.string().required(),
    commentCreationTime: Joi.number().required(),
    comment: Joi.string().required(),
  });
  return schema.validate(incomingComment);
};
module.exports = router;
