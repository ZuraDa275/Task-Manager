const mongoose = require("mongoose");

const taskMemberSchema = new mongoose.Schema({
  members: [
    {
      _id: mongoose.ObjectId,
      name: String,
      isTaskAdmin: Boolean,
      profileImage: String,
    },
  ],
});

const validateMembersToBeAdded = async (memberList, Users) => {
  let taskMember = "";
  for (let i = 0; i < memberList.length; i++) {
    taskMember = await Users.findById(memberList[i]._id);
    if (!taskMember)
      return {
        msg: "Member you're trying to add doesn't exist",
      };
    taskMember = "";
  }
};

const validateNewMembers = (memberList, concernedTask) => {
  let alreadyExist = "";
  for (let i = 0; i < memberList.length; i++) {
    alreadyExist = concernedTask?.memberList?.members?.find(
      (user) => user.name === memberList[i].name
    );
    if (alreadyExist)
      return {
        msg: "Member you're trying to add is already a part of the task!",
      };
    alreadyExist = "";
  }
};

const MemberLists = mongoose.model("MemberList", taskMemberSchema);

module.exports = {
  taskMemberSchema,
  MemberLists,
  validateMembersToBeAdded,
  validateNewMembers,
};
