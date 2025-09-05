const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
    note: { type: mongoose.Schema.Types.ObjectId, ref: "Note" },
    views: { type: Number },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
