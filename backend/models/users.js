require("dotenv").config();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Joi = require("joi");
const { taskSchema } = require("./taskSchema");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  profileImage: {
    type: String,
  },
  tasks: [taskSchema],
  notifications: [
    {
      notifMessage: String,
      createdAt: Number,
      tag: {
        type: String,
        enum: ["Task Updates", "Today's Tasks", "Incompleted Tasks"],
      },
    },
  ],
  notifDate: String,
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
  return token;
};
userSchema.methods.generateTaskReferralID = function (referralTaskID) {
  const referralID = jwt.sign(
    { _id: this._id, referralTaskID },
    process.env.TASK_REFERRAL
  );
  return referralID;
};

const Users = mongoose.model("User", userSchema);

const validateUsers = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required().alphanum(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    profileImage: Joi.string(),
  });
  return schema.validate(user);
};

module.exports = {
  Users,
  validateUsers,
};
