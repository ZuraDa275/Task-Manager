const mongoose = require("mongoose");

const subTaskSchema = new mongoose.Schema({
  taskName: {
    type: String,
    minlength: 3,
    maxlength: 15,
    required: true,
  },
  taskDescription: {
    type: String,
    minlength: 5,
    maxlength: 100,
    required: true,
  },
  isCompleted: {
    type: Boolean,
  },
  assignedMember: {
    _id: mongoose.ObjectId,
    name: String,
  },
});

const Subtasks = mongoose.model("Subtask", subTaskSchema);

module.exports = { subTaskSchema, Subtasks };
