const Course = require("../models/Course");
const Department = require("../models/Department");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("teacher")
      .populate("students")
      .populate("department");
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("videos")
      .populate("teacher")
      .populate("department")
      .populate("note");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const course = new Course(req.body);

    if (course.department) {
      await Department.findByIdAndUpdate(course.department, {
        $addToSet: { courses: course._id },
      });
      await Teacher.findByIdAndUpdate(course.teacher, {
        $addToSet: { courses: course._id },
      });
    }

    const newCourse = await course.save();
    res.status(201).json({ data: newCourse, message: "Course created" });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const newDepartmentId = req.body.department;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const oldDepartmentId = course.department;

    const updatedCourse = await Course.findByIdAndUpdate(courseId, req.body, {
      new: true,
    })
      .populate("videos")
      .populate("teacher")
      .populate("department");

    if (
      oldDepartmentId &&
      oldDepartmentId.toString() !== newDepartmentId.toString()
    ) {
      await Department.findByIdAndUpdate(oldDepartmentId, {
        $pull: { courses: courseId },
      });
    }

    await Department.findByIdAndUpdate(newDepartmentId, {
      $addToSet: { courses: courseId },
    });

    res.status(201).json({ data: updatedCourse, message: "Course updated" });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (course.department) {
      await Department.findByIdAndUpdate(course.department, {
        $pull: { courses: course._id },
      });
    }

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.enrollCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { student, enroll } = req.body;
    if (student && enroll) {
      await Course.findByIdAndUpdate(
        id,
        { $addToSet: { students: student } },
        { new: true }
      );

      await Student.findByIdAndUpdate(
        student,
        { $addToSet: { coursesEnrolled: id } },
        { new: true }
      );
      return res.json({ message: "Course Enrolled!" });
    } else if (student && !enroll) {
      await Course.findByIdAndUpdate(
        id,
        { $pull: { students: student } },
        { new: true }
      );

      await Student.findByIdAndUpdate(
        student,
        { $pull: { coursesEnrolled: id } },
        { new: true }
      );
      return res.json({ message: "Course Unenrolled" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
};

exports.viewCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};
