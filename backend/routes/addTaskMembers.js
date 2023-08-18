const { Users } = require("../models/users");
const {
  validateMembersToBeAdded,
  validateNewMembers,
} = require("../models/memberSchema");
const { Tasks } = require("../models/taskSchema");
const authorizeUser = require("../middleware/auth");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const express = require("express");
const router = express.Router();
const Joi = require("joi");
const commentHandler = require("../middleware/commentHandler");
const { memberNotifier } = require("./addComments");
Joi.objectId = require("joi-objectid")(Joi);

router.put(
  "/",
  authorizeUser,
  commentHandler,
  asyncErrorHandler(async (req, res) => {
    const { error } = validateNewMember(req.body);
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }

    const currentUser = await Users.findById(req.user._id);

    if (!currentUser) return res.status(404).json({ msg: "User not found!" });
    const currentUserName = currentUser.name;

    const userWithTask = await Users.findById(req.commentInfo._id);
    const userWithTaskName = userWithTask.name;

    let commonUser =
      userWithTaskName !== currentUserName ? userWithTask : currentUser;

    const taskInWhichNewMembersAreToBeAdded = commonUser.tasks.id(
      req.body.taskID
    );

    if (!taskInWhichNewMembersAreToBeAdded)
      return res.status(404).json({
        msg: "Task for which you're trying to add a member doesn't exist",
      });

    if (req.body?.members && req.body?.members?.length > 0) {
      const validationForNewMembers = await validateMembersToBeAdded(
        req.body?.members,
        Users
      );
      if (validationForNewMembers) {
        return res.status(404).json(validationForNewMembers);
      }
      if (
        validateNewMembers(req.body?.members, taskInWhichNewMembersAreToBeAdded)
      )
        return res
          .status(400)
          .json(
            validateNewMembers(
              req.body?.members,
              taskInWhichNewMembersAreToBeAdded
            )
          );

      const newMemberList = await addProfileImages(req.body?.members);

      taskInWhichNewMembersAreToBeAdded.memberList.members = [
        ...taskInWhichNewMembersAreToBeAdded?.memberList?.members,
        ...newMemberList,
      ];

      const referralTaskID = new Tasks({
        taskName: taskInWhichNewMembersAreToBeAdded.taskName,
        taskDescription: taskInWhichNewMembersAreToBeAdded.taskDescription,
        taskStartDate: taskInWhichNewMembersAreToBeAdded.taskStartDate,
        taskStartTime: taskInWhichNewMembersAreToBeAdded.taskStartTime,
        isCompleted: false,
        priority: taskInWhichNewMembersAreToBeAdded.priority,
        referralTaskID: taskInWhichNewMembersAreToBeAdded.referralTaskID,
      });

      //Passing the referralID to the other members
      newMemberList?.forEach(async (mem) => {
        const taskMember = await Users.findById(mem._id);
        taskMember.tasks.push(referralTaskID);
        await taskMember.save();
      });
      await commonUser.save();
      res.status(200).json({ msg: "Member added successfully!" });
      await memberNotifier({
        concernedTaskMembers: req.body?.members,
        notifMessage: `You've been added to a new task activity: <span class=colored>${taskInWhichNewMembersAreToBeAdded.taskName}</span>`,
      });
    } else {
      res.status(404).json({ msg: "No members were added!" });
    }
  })
);

const addProfileImages = async (memberList) => {
  let taskMember = "";
  for (let i = 0; i < memberList.length; i++) {
    taskMember = await Users.findById(memberList[i]._id);
    memberList[i].profileImage = taskMember.profileImage;
    taskMember = "";
  }
  return memberList;
};

const validateNewMember = (incomingNewMember) => {
  const schema = Joi.object({
    taskID: Joi.objectId().required(),
    referralTaskID: Joi.string().required(),
    members: Joi.array().items(
      Joi.object({
        _id: Joi.objectId().required(),
        name: Joi.string().required(),
        isTaskAdmin: Joi.boolean().required(),
        profileImage: Joi.string(),
      })
    ),
  });
  return schema.validate(incomingNewMember);
};

module.exports = router;
