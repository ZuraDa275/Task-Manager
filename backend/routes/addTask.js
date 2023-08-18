const { Users } = require("../models/users");
const {
  MemberLists,
  validateMembersToBeAdded,
} = require("../models/memberSchema");
const { Tasks, validateTasks } = require("../models/taskSchema");
const authorizeUser = require("../middleware/auth");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const express = require("express");
const router = express.Router();
const { memberNotifier } = require("./addComments");
const crypto = require("crypto");

router.put(
  "/",
  authorizeUser,
  asyncErrorHandler(async (req, res) => {
    const { error } = validateTasks(req.body);
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }

    const currentUser = await Users.findById(req.user._id);

    if (!currentUser) return res.status(404).json({ msg: "User not found!" });

    const newTaskAdded = new Tasks({
      taskName: req.body.taskName,
      taskDescription: req.body.taskDescription,
      taskStartDate: req.body.taskStartDate,
      taskStartTime: req.body.taskStartTime,
      isCompleted: false,
      priority: req.body.priority,
    });

    if (req.body?.members && req.body?.members?.length > 0) {
      const validationForNewMembers = await validateMembersToBeAdded(
        req.body?.members,
        Users
      );
      if (validationForNewMembers) {
        return res.status(404).json(validationForNewMembers);
      }

      const newMemberList = await addProfileImages(req.body?.members);
      const newTaskMemberList = new MemberLists({
        members: [
          {
            _id: req.user._id,
            name: currentUser.name,
            isTaskAdmin: true,
            profileImage: currentUser.profileImage,
          },
          ...newMemberList,
        ],
      });

      newTaskAdded.memberList = newTaskMemberList;
      const referralID = currentUser.generateTaskReferralID(
        crypto.randomBytes(20).toString("hex")
      );

      const referralTaskID = new Tasks({
        taskName: req.body.taskName,
        taskDescription: req.body.taskDescription,
        taskStartDate: req.body.taskStartDate,
        taskStartTime: req.body.taskStartTime,
        isCompleted: false,
        priority: req.body.priority,
        referralTaskID: referralID,
      });
      newTaskAdded.referralTaskID = referralID;
      //Passing the referralID to the other members
      req.body?.members?.forEach(async (mem) => {
        const taskMember = await Users.findById(mem._id);
        taskMember.tasks.push(referralTaskID);
        await taskMember.save();
      });
    }
    currentUser.tasks.push(newTaskAdded);
    await currentUser.save();
    res.status(200).json({ msg: "Task added successfully!" });
    if (req.body.members) {
      await memberNotifier({
        concernedTaskMembers: req.body.members,
        notifMessage: `You've been added to a new task activity: <span class=colored>${req.body.taskName}</span>`,
      });
    }
  })
);

const addProfileImages = async (memberList) => {
  let taskMember = "";
  for (let i = 0; i < memberList.length; i++) {
    taskMember = await Users.findById(memberList[i]._id);
    memberList[i].profileImage = taskMember?.profileImage;
    taskMember = "";
  }
  return memberList;
};

module.exports = router;
