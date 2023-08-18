const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const { Users } = require("../models/users");
const authorizeUser = require("../middleware/auth");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const commentHandler = require("../middleware/commentHandler");
const express = require("express");
const router = express.Router();

router.post(
  "/",
  authorizeUser,
  commentHandler,
  asyncErrorHandler(async (req, res) => {
    const { error } = validateReferences(req.body);
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

    const tasks = commonUser.tasks.id(req.body.taskID);
    res.status(200).json({
      comments: tasks.comments,
    });
  })
);

const validateReferences = (incomingReferences) => {
  const schema = Joi.object({
    taskID: Joi.objectId().required(),
    referralTaskID: Joi.string(),
  });
  return schema.validate(incomingReferences);
};
module.exports = router;
