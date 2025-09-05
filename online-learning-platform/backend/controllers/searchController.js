const Course = require("../models/Course");
const Department = require("../models/Department");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const Video = require("../models/Video");
const Note = require("../models/Note");

function checkAllPresent(query, caseX) {
  for (const item of caseX) {
    if (!Object.keys(query).includes(item)) {
      return false;
    }
  }
  return true;
}

// p = priority
const case1 = ["Teacher", "Department", "Course"]; // valid  p1 Teacher, p2 course, p3 department
const case2 = ["Note", "Video", "Course"]; // valid p1 = p2 = course, video
const case3 = ["Teacher", "Video", "Course"]; // valid p1 teacher, p2 course
const case4 = ["Teacher", "Course", "Student"]; // valid p1 course, p2 student

exports.getSearch = async (req, res) => {
  const query = req.query;

  try {
    if (checkAllPresent(query, case1)) {
      if (Object.values(query).every((value) => value === "")) {
        const allResults = await Teacher.aggregate([
          {
            $lookup: {
              from: "courses",
              localField: "courses",
              foreignField: "_id",
              as: "courses",
            },
          },
          {
            $unwind: { path: "$courses", preserveNullAndEmptyArrays: true },
          },
          {
            $lookup: {
              from: "departments",
              localField: "courses.department",
              foreignField: "_id",
              as: "department",
            },
          },
          {
            $unwind: { path: "$department", preserveNullAndEmptyArrays: true },
          },
          {
            $project: {
              _id: 0,
              teacher: "$name",
              course: { $ifNull: ["$courses.name", ""] },
              department: { $ifNull: ["$department.name", ""] },
            },
          },
        ]);

        console.log(allResults, allResults.length);
        return res.json(allResults);
      }

      if (query.Teacher && query.Course && query.Department) {
        const teacherCourseDepartmentResults = await Teacher.aggregate([
          {
            $match: {
              name: { $regex: query.Teacher, $options: "i" },
            },
          },
          {
            $lookup: {
              from: "courses",
              localField: "courses",
              foreignField: "_id",
              as: "courses",
            },
          },
          {
            $unwind: "$courses",
          },
          {
            $match: {
              "courses.name": { $regex: query.Course, $options: "i" },
            },
          },
          {
            $lookup: {
              from: "departments",
              localField: "courses.department",
              foreignField: "_id",
              as: "department",
            },
          },
          {
            $unwind: "$department",
          },
          {
            $match: {
              "department.name": { $regex: query.Department, $options: "i" },
            },
          },
          {
            $project: {
              _id: 0,
              teacher: "$name",
              course: "$courses.name",
              department: "$department.name",
            },
          },
        ]);

        console.log(
          teacherCourseDepartmentResults,
          teacherCourseDepartmentResults.length
        );
        return res.json(teacherCourseDepartmentResults);
      }

      if (query.Teacher && query.Course && !query.Department) {
        const teacherCourseResults = await Teacher.aggregate([
          {
            $match: {
              name: { $regex: query.Teacher, $options: "i" },
            },
          },
          {
            $lookup: {
              from: "courses",
              localField: "courses",
              foreignField: "_id",
              as: "courses",
            },
          },
          {
            $unwind: "$courses",
          },
          {
            $match: {
              "courses.name": { $regex: query.Course, $options: "i" },
            },
          },
          {
            $lookup: {
              from: "departments",
              localField: "courses.department",
              foreignField: "_id",
              as: "department",
            },
          },
          {
            $unwind: "$department",
          },
          {
            $project: {
              _id: 0,
              teacher: "$name",
              course: "$courses.name",
              department: "$department.name",
            },
          },
        ]);

        console.log(teacherCourseResults, teacherCourseResults.length);
        return res.json(teacherCourseResults);
      }

      res.status(404).json({ message: "No data found" });
    }

    if (checkAllPresent(query, case2)) {
      if (!query.Course && !query.Video && !query.Note) {
        const allCoursesWithVideosAndNotes = await Course.aggregate([
          {
            $lookup: {
              from: "videos",
              localField: "_id",
              foreignField: "course",
              as: "videos",
            },
          },
          {
            $lookup: {
              from: "notes",
              localField: "_id",
              foreignField: "course",
              as: "notes",
            },
          },
          {
            $project: {
              _id: 0,
              course: "$name",
              note: { $arrayElemAt: ["$notes.title", 0] },
              videos: {
                $map: { input: "$videos", as: "video", in: "$$video.title" },
              },
            },
          },
          {
            $addFields: {
              note: { $ifNull: ["$note", ""] },
            },
          },
        ]);
        console.log(
          allCoursesWithVideosAndNotes,
          allCoursesWithVideosAndNotes.length
        );
        return res.json(allCoursesWithVideosAndNotes);
      }

      if (query.Note && query.Video && query.Course) {
        const courseWithVideosAndNote = await Course.aggregate([
          {
            $lookup: {
              from: "videos",
              localField: "_id",
              foreignField: "course",
              as: "videos",
            },
          },
          {
            $lookup: {
              from: "notes",
              localField: "_id",
              foreignField: "course",
              as: "notes",
            },
          },
          {
            $match: {
              name: { $regex: query.Course, $options: "i" },
              "videos.title": { $regex: query.Video, $options: "i" },
              "notes.title": { $regex: query.Note, $options: "i" },
            },
          },
          {
            $project: {
              _id: 0,
              course: "$name",
              note: { $arrayElemAt: ["$notes.title", 0] },
              videos: {
                $map: { input: "$videos", as: "video", in: "$$video.title" },
              },
            },
          },
          {
            $addFields: {
              note: { $ifNull: ["$note", ""] },
            },
          },
        ]);
        console.log(courseWithVideosAndNote, courseWithVideosAndNote.length);
        return res.json(courseWithVideosAndNote);
      }

      if (!query.Course && query.Video && query.Note) {
        const courseWithVideosAndNote = await Course.aggregate([
          {
            $lookup: {
              from: "videos",
              localField: "_id",
              foreignField: "course",
              as: "videos",
            },
          },
          {
            $lookup: {
              from: "notes",
              localField: "_id",
              foreignField: "course",
              as: "notes",
            },
          },
          {
            $match: {
              "videos.title": { $regex: query.Video, $options: "i" },
              "notes.title": { $regex: query.Note, $options: "i" },
            },
          },
          {
            $project: {
              _id: 0,
              course: "$name",
              note: { $arrayElemAt: ["$notes.title", 0] },
              videos: {
                $map: { input: "$videos", as: "video", in: "$$video.title" },
              },
            },
          },
          {
            $addFields: {
              note: { $ifNull: ["$note", ""] },
            },
          },
        ]);
        console.log(courseWithVideosAndNote, courseWithVideosAndNote.length);
        return res.json(courseWithVideosAndNote);
      }

      res.status(404).json({ message: "No data found" });
    }

    if (checkAllPresent(query, case3)) {
      if (Object.values(query).every((value) => value === "")) {
        const allResults = await Teacher.aggregate([
          {
            $lookup: {
              from: "courses",
              localField: "courses",
              foreignField: "_id",
              as: "courses",
            },
          },
          {
            $unwind: { path: "$courses", preserveNullAndEmptyArrays: true },
          },
          {
            $lookup: {
              from: "videos",
              localField: "courses._id",
              foreignField: "course",
              as: "videos",
            },
          },
          {
            $project: {
              _id: 0,
              teacher: "$name",
              course: { $ifNull: ["$courses.name", ""] },
              videos: {
                $map: { input: "$videos", as: "video", in: "$$video.title" },
              },
            },
          },
        ]);

        console.log(allResults, allResults.length);
        return res.json(allResults);
      }

      if (query.Teacher && query.Course && !query.Video) {
        const teacherCourseResults = await Teacher.aggregate([
          {
            $match: {
              name: { $regex: query.Teacher, $options: "i" },
            },
          },
          {
            $lookup: {
              from: "courses",
              localField: "courses",
              foreignField: "_id",
              as: "courses",
            },
          },
          {
            $unwind: "$courses",
          },
          {
            $match: {
              "courses.name": { $regex: query.Course, $options: "i" },
            },
          },
          {
            $lookup: {
              from: "videos",
              localField: "courses._id",
              foreignField: "course",
              as: "videos",
            },
          },
          {
            $project: {
              _id: 0,
              teacher: "$name",
              course: "$courses.name",
              videos: {
                $map: { input: "$videos", as: "video", in: "$$video.title" },
              },
            },
          },
        ]);

        console.log(teacherCourseResults, teacherCourseResults.length);
        return res.json(teacherCourseResults);
      }

      if (query.Teacher && query.Course && query.Video) {
        const teacherCourseVideoResults = await Teacher.aggregate([
          {
            $match: {
              name: { $regex: query.Teacher, $options: "i" },
            },
          },
          {
            $lookup: {
              from: "courses",
              localField: "courses",
              foreignField: "_id",
              as: "courses",
            },
          },
          {
            $unwind: "$courses",
          },
          {
            $match: {
              "courses.name": { $regex: query.Course, $options: "i" },
            },
          },
          {
            $lookup: {
              from: "videos",
              let: { course_id: "$courses._id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$course", "$$course_id"] },
                        {
                          $regexMatch: {
                            input: "$title",
                            regex: query.Video,
                            options: "i",
                          },
                        },
                      ],
                    },
                  },
                },
              ],
              as: "videos",
            },
          },
          {
            $project: {
              _id: 0,
              teacher: "$name",
              course: "$courses.name",
              videos: {
                $map: { input: "$videos", as: "video", in: "$$video.title" },
              },
            },
          },
        ]);

        console.log(
          teacherCourseVideoResults,
          teacherCourseVideoResults.length
        );
        return res.json(teacherCourseVideoResults);
      }

      res.status(404).json({ message: "No data found" });
    }

    if (checkAllPresent(query, case4)) {
      if (!query.Teacher && !query.Course && !query.Student) {
        const allCourses = await Course.aggregate([
          {
            $lookup: {
              from: "teachers",
              localField: "teacher",
              foreignField: "_id",
              as: "teacher",
            },
          },
          {
            $lookup: {
              from: "students",
              localField: "students",
              foreignField: "_id",
              as: "students",
            },
          },
          {
            $project: {
              _id: 0,
              course: "$name",
              teacher: {
                $ifNull: [{ $arrayElemAt: ["$teacher.name", 0] }, ""],
              },
              students: "$students.name",
            },
          },
        ]);

        console.log(allCourses, allCourses.length);
        return res.json(allCourses);
      }

      if (query.Student && query.Teacher && query.Course) {
        const studentTeacherCourseResults = await Course.aggregate([
          {
            $lookup: {
              from: "teachers",
              localField: "teacher",
              foreignField: "_id",
              as: "teacher",
            },
          },
          {
            $lookup: {
              from: "students",
              localField: "students",
              foreignField: "_id",
              as: "students",
            },
          },
          {
            $match: {
              "students.name": { $regex: query.Student, $options: "i" },
              "teacher.name": { $regex: query.Teacher, $options: "i" },
              name: { $regex: query.Course, $options: "i" },
            },
          },
          {
            $project: {
              _id: 0,
              course: "$name",
              teacher: { $arrayElemAt: ["$teacher.name", 0] },
              students: "$students.name",
            },
          },
        ]);

        console.log(
          studentTeacherCourseResults,
          studentTeacherCourseResults.length
        );
        return res.json(studentTeacherCourseResults);
      }

      if (query.Teacher && query.Course && !query.Student) {
        const teacherCourseResults = await Course.aggregate([
          {
            $lookup: {
              from: "teachers",
              localField: "teacher",
              foreignField: "_id",
              as: "teacher",
            },
          },
          {
            $match: {
              "teacher.name": { $regex: query.Teacher, $options: "i" },
              name: { $regex: query.Course, $options: "i" },
            },
          },
          {
            $lookup: {
              from: "students",
              localField: "students",
              foreignField: "_id",
              as: "students",
            },
          },
          {
            $project: {
              _id: 0,
              course: "$name",
              teacher: query.Teacher,
              students: "$students.name",
            },
          },
        ]);

        console.log(teacherCourseResults, teacherCourseResults.length);
        return res.json(teacherCourseResults);
      }

      res.status(404).json({ message: "No data found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
