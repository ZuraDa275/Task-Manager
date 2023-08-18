const mongoose = require("mongoose");
const { taskMemberSchema } = require("./memberSchema");
const { subTaskSchema } = require("./subtaskSchema");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const taskSchema = new mongoose.Schema({
  taskName: {
    type: String,
    minlength: 3,
    maxlength: 15,
    required: true,
  },
  taskDescription: {
    type: String,
    minlength: 5,
    maxlength: 200,
    required: true,
  },
  taskStartDate: {
    type: String,
    required: true,
  },
  taskStartTime: {
    type: String,
    required: true,
  },
  isCompleted: {
    type: Boolean,
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
  },
  referralTaskID: {
    type: String,
  },
  memberList: taskMemberSchema,
  subtasks: [subTaskSchema],
  comments: [
    {
      name: String,
      comment: {
        type: String,
        maxlength: 150,
      },
      creationTime: Number,
    },
  ],
});

const validateTasks = (task) => {
  const schema = Joi.object({
    taskName: Joi.string().min(3).max(15).required(),
    taskDescription: Joi.string().min(5).max(200).required(),
    taskStartDate: Joi.string().required(),
    taskStartTime: Joi.string().required(),
    isCompleted: Joi.boolean(),
    priority: Joi.string().required().valid("Low", "Medium", "High"),
    referralTaskID: Joi.string(),
    members: Joi.array().items(
      Joi.object({
        _id: Joi.objectId().required(),
        name: Joi.string().required(),
        isTaskAdmin: Joi.boolean().required(),
        profileImage: Joi.string(),
      })
    ),
  });
  return schema.validate(task);
};

const Tasks = mongoose.model("Task", taskSchema);

module.exports = {
  taskSchema,
  Tasks,
  validateTasks,
};
