const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  dueDate: Date,
  tags: [String],
  completed: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Task", TaskSchema);
