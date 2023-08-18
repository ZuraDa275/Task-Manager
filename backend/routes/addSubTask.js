const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const { Users } = require("../models/users");
const { Subtasks } = require("../models/subtaskSchema");
const authorizeUser = require("../middleware/auth");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const express = require("express");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { memberNotifier } = require("./addComments");
const router = express.Router();

router.put(
  "/",
  authorizeUser,
  asyncErrorHandler(async (req, res) => {
    const { error } = validateSubTasks(req.body);
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }

    const currentUser = await Users.findById(req.user._id);

    if (!currentUser) return res.status(404).json({ msg: "User not found!" });
    const currentUserName = currentUser?.name;

    if (req.body?.referralTaskID) {
      const decoded = jwt.verify(
        req.body?.referralTaskID,
        process.env.TASK_REFERRAL
      );
      const userWithTask = await Users.findById(decoded._id);
      if (!userWithTask)
        return res.status(404).json({
          msg: "The creator of this task doesn't exist",
        });
      const userWithTaskName = userWithTask?.name;

      const commonUser =
        userWithTaskName !== currentUserName ? userWithTask : currentUser;

      const taskInWhichSubtaskIsGoingToBeAdded = commonUser.tasks.id(
        req.body.id
      );
      if (!taskInWhichSubtaskIsGoingToBeAdded)
        return res
          .status(404)
          .json({ msg: "Task doesn't exist, please try again!" });

      const newSubTaskAdded = new Subtasks({
        taskName: req.body.taskName,
        taskDescription: req.body.taskDescription,
        isCompleted: false,
      });
      taskInWhichSubtaskIsGoingToBeAdded.subtasks.push(newSubTaskAdded);
      await commonUser.save();
      res.status(200).json({ msg: "Subtask added successfully!" });
      await memberNotifier({
        concernedTaskMembers:
          taskInWhichSubtaskIsGoingToBeAdded?.memberList?.members.filter(
            (mem) => mem.name !== currentUser.name
          ),
        notifMessage: `A new subtask has been added to <span class=colored>${taskInWhichSubtaskIsGoingToBeAdded.taskName}</span>: <span class=colored>${req.body.taskName}</span>`,
      });
      return;
    }
    const taskInWhichSubtaskIsGoingToBeAdded = currentUser.tasks.id(
      req.body.id
    );
    if (!taskInWhichSubtaskIsGoingToBeAdded)
      return res
        .status(404)
        .json({ msg: "Task doesn't exist, please try again!" });

    const newSubTaskAdded = new Subtasks({
      taskName: req.body.taskName,
      taskDescription: req.body.taskDescription,
      isCompleted: false,
    });

    taskInWhichSubtaskIsGoingToBeAdded.subtasks.push(newSubTaskAdded);

    await currentUser.save();
    res.status(200).json({ msg: "Subtask added successfully!" });
  })
);

const validateSubTasks = (incomingSubTasks) => {
  const schema = Joi.object({
    id: Joi.objectId().required(),
    referralTaskID: Joi.string(),
    taskName: Joi.string().min(3).max(15).required(),
    taskDescription: Joi.string().min(5).max(100).required(),
    isCompleted: Joi.boolean(),
  });
  return schema.validate(incomingSubTasks);
};
module.exports = router;
