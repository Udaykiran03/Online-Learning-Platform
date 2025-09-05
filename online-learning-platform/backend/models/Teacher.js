const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    type: { type: String, required: true, default: "TEACHER" },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  },
  {
    timestamps: true,
  }
);

const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;
