const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const { Users } = require("../models/users");
const authorizeUser = require("../middleware/auth");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const commentHandler = require("../middleware/commentHandler");
const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const crypto = require("crypto");
const router = express.Router();

router.put(
  "/",
  authorizeUser,
  commentHandler,
  asyncErrorHandler(async (req, res) => {
    const { error } = validateLeavingMember(req.body);
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }

    const currentUser = await Users.findById(req.user._id);

    if (!currentUser) return res.status(404).json({ msg: "User not found!" });
    const currentUserName = currentUser?.name;

    const userWithTheTask = await Users.findById(req.commentInfo._id);
    const userWithTaskName = userWithTheTask?.name;

    if (currentUserName === userWithTaskName) {
      const taskToLeave = currentUser.tasks.id(req.body.taskID);
      const memberIndex = taskToLeave?.memberList?.members?.findIndex(
        (mem) => mem?.name === currentUserName
      );
      taskToLeave?.memberList?.members?.splice(memberIndex, 1);
      const { membersList, newTaskAdminIndex } = makeAnAdminOnLeaving(
        taskToLeave?.memberList?.members
      );
      taskToLeave.memberList.members = [...membersList];

      // Adding the reference task to the new task admin
      const newTaskAdmin = await Users.findById(
        taskToLeave.memberList.members[newTaskAdminIndex]._id
      );

      const taskToBeReplacedIndex = newTaskAdmin.tasks.findIndex(
        (task) => task.referralTaskID === req.body.referralTaskID
      );

      // New referralTaskID generation for the admin
      const newTaskReferralID = generateNewTaskReferralID(
        newTaskAdmin._id,
        crypto.randomBytes(20).toString("hex")
      );

      taskToLeave.referralTaskID = newTaskReferralID;
      // To notify that the user left the task group
      taskToLeave.comments.push({
        name: currentUserName,
        comment: currentUserName,
        creationTime: new Date().getTime(),
      });
      //Passing the referralTaskID to the other members
      taskToLeave.memberList.members
        .filter((mem) => mem.name !== newTaskAdmin.name)
        .forEach(async (mem) => {
          const taskMember = await Users.findById(mem._id);
          const concernedTask = taskMember.tasks.find(
            (memberTask) =>
              memberTask.referralTaskID === req.body.referralTaskID
          );
          concernedTask.referralTaskID = newTaskReferralID;
          await taskMember.save();
        });

      newTaskAdmin.tasks.splice(taskToBeReplacedIndex, 1, taskToLeave);
      await newTaskAdmin.save();

      currentUser.tasks.pull(req.body.taskID);
      await currentUser.save();
      res.status(200).json({
        msg: "Left the task group successfully",
      });
    } else {
      const taskToLeave = userWithTheTask.tasks.id(req.body.taskID);
      const memberIndex = taskToLeave?.memberList?.members?.findIndex(
        (mem) => mem?.name === currentUserName
      );
      taskToLeave?.memberList?.members?.splice(memberIndex, 1);
      // To notify that the user left the task group
      taskToLeave.comments.push({
        name: currentUserName,
        comment: currentUserName,
        creationTime: new Date().getTime(),
      });
      await userWithTheTask.save();

      const taskToBeRemovedIndex = currentUser.tasks.findIndex(
        (task) => task.referralTaskID === req.body.referralTaskID
      );
      currentUser.tasks.splice(taskToBeRemovedIndex, 1);
      await currentUser.save();
      res.status(200).json({
        msg: "Left the task group successfully",
      });
    }
  })
);

const makeAnAdminOnLeaving = (concernedTaskMembers) => {
  for (var i = 0; i < concernedTaskMembers.length; i++) {
    if (concernedTaskMembers[i]?.isTaskAdmin) {
      return {
        membersList: concernedTaskMembers,
        newTaskAdminIndex: i,
      };
    }
  }
  if (i === concernedTaskMembers.length) {
    const chooseMemberToBeAdminAtRandom = Math.floor(
      Math.random() * concernedTaskMembers.length
    );
    concernedTaskMembers[chooseMemberToBeAdminAtRandom].isTaskAdmin = true;
    return {
      membersList: concernedTaskMembers,
      newTaskAdminIndex: chooseMemberToBeAdminAtRandom,
    };
  }
};

const generateNewTaskReferralID = (id, referralTaskID) => {
  const referralID = jwt.sign(
    { _id: id, referralTaskID },
    process.env.TASK_REFERRAL
  );
  return referralID;
};

const validateLeavingMember = (incomingMember) => {
  const schema = Joi.object({
    taskID: Joi.objectId().required(),
    referralTaskID: Joi.string(),
  });
  return schema.validate(incomingMember);
};
module.exports = router;
