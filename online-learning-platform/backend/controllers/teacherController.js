const Teacher = require("../models/Teacher");
const Department = require("../models/Department");

exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).populate(
      "department"
    );
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createTeacher = async (req, res) => {
  const teacher = new Teacher(req.body);
  try {
    const newTeacher = await teacher.save();
    res.status(201).json(newTeacher);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateTeacher = async (req, res) => {
  try {
    const teacherId = req.params.id;
    const newDepartmentId = req.body.department;

    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const oldDepartmentId = teacher.department;

    const updatedTeacher = await Teacher.findByIdAndUpdate(
      teacherId,
      req.body,
      {
        new: true,
      }
    );

    if (
      oldDepartmentId &&
      oldDepartmentId.toString() !== newDepartmentId.toString()
    ) {
      await Department.findByIdAndUpdate(oldDepartmentId, {
        $pull: { teachers: teacherId },
      });
    }

    await Teacher.findByIdAndUpdate(teacherId, { department: newDepartmentId });

    await Department.findByIdAndUpdate(newDepartmentId, {
      $addToSet: { teachers: teacherId },
    });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.json({ data: updatedTeacher, message: "Teacher Profile updated" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);

    if (teacher.department) {
      await Department.findByIdAndUpdate(
        teacher.department,
        { $pull: { teachers: teacher._id } },
        { new: true }
      );
    }

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.json({ message: "Teacher Profile deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
