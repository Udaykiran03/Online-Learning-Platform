const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");

router.get("/", courseController.getAllCourses);
router.get("/:id", courseController.getCourseById);
router.post("/", courseController.createCourse);
router.patch("/:id", courseController.updateCourse);
router.patch("/:id/enroll", courseController.enrollCourse);
router.patch("/:id/view", courseController.viewCourse);
router.delete("/:id", courseController.deleteCourse);

module.exports = router;
