const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const { Users } = require("../models/users");
const authorizeUser = require("../middleware/auth");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const express = require("express");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { singleMemberNotifier } = require("./assignMemberForSubtask");
const router = express.Router();

router.put(
  "/",
  authorizeUser,
  asyncErrorHandler(async (req, res) => {
    const { error } = validateSubTaskDeletion(req.body);
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }

    const currentUser = await Users.findById(req.user._id);

    if (!currentUser) return res.status(404).json({ msg: "User not found!" });
    const currentUserName = currentUser.name;
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

      const taskInWhichSubtaskIsGoingToBeDeleted = commonUser.tasks.id(
        req.body.taskID
      );
      if (!taskInWhichSubtaskIsGoingToBeDeleted)
        return res
          .status(404)
          .json({ msg: "Task doesn't exist, please try again!" });

      const subTaskToBeDeleted =
        taskInWhichSubtaskIsGoingToBeDeleted.subtasks.id(req.body.subTaskID);

      if (!subTaskToBeDeleted)
        return res
          .status(404)
          .json({ msg: "SubTask couldn't be found, please try again!" });

      const subTaskDeepCopy = JSON.parse(JSON.stringify(subTaskToBeDeleted));

      subTaskToBeDeleted.remove();
      await commonUser.save();
      res.status(200).json({ msg: "Subtask deleted successfully!" });

      if (subTaskDeepCopy.assignedMember) {
        const assignedMemberToBeRemoved = await Users.findById(
          subTaskDeepCopy.assignedMember._id
        );
        await singleMemberNotifier({
          concernedMember: assignedMemberToBeRemoved,
          notifMessage: `You're no longer assigned to the subtask: <span class=colored>${subTaskDeepCopy.taskName}</span>`,
        });
      }
      return;
    }
    const taskInWhichSubtaskIsGoingToBeDeleted = currentUser.tasks.id(
      req.body.taskID
    );
    if (!taskInWhichSubtaskIsGoingToBeDeleted)
      return res
        .status(404)
        .json({ msg: "Task doesn't exist, please try again!" });

    const subTaskToBeDeleted = taskInWhichSubtaskIsGoingToBeDeleted.subtasks.id(
      req.body.subTaskID
    );

    if (!subTaskToBeDeleted)
      return res
        .status(404)
        .json({ msg: "SubTask couldn't be found, please try again!" });

    subTaskToBeDeleted.remove();

    await currentUser.save();
    res.status(200).json({ msg: "Subtask deleted successfully!" });
  })
);

const validateSubTaskDeletion = (incomingSubTaskDelReq) => {
  const schema = Joi.object({
    taskID: Joi.objectId().required(),
    referralTaskID: Joi.string(),
    subTaskID: Joi.objectId().required(),
  });
  return schema.validate(incomingSubTaskDelReq);
};
module.exports = router;
