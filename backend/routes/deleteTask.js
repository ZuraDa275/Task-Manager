const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const { Users } = require("../models/users");
const authorizeUser = require("../middleware/auth");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const express = require("express");
const router = express.Router();

router.put(
  "/",
  authorizeUser,
  asyncErrorHandler(async (req, res) => {
    const { error } = validateDeletion(req.body);
    if (error) return res.status(400).json({ msg: error.details[0].message });

    const currentUser = await Users.findById(req.user._id);

    if (!currentUser) return res.status(404).json({ msg: "User not found!" });
    // const currentUserName = currentUser.name;
    const taskToBeDeleted = currentUser.tasks.id(req.body.id);

    if (!taskToBeDeleted)
      return res.status(404).json({ msg: "Task not found!" });

    taskToBeDeleted.remove();

    await currentUser.save();
    res.status(200).json({ msg: "Task Deleted Successfully!" });
  })
);

const validateDeletion = (incomingDeleteReq) => {
  const schema = Joi.object({
    id: Joi.objectId().required(),
  });
  return schema.validate(incomingDeleteReq);
};

module.exports = router;
