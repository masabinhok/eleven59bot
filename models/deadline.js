const mongoose = require("mongoose");

const deadlineSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    task: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Deadline = mongoose.model("deadline", deadlineSchema);

module.exports = Deadline;
