import express from "express";
import {
  addLesson,
  createCourse,
  deleteCourse,
  getAllCourses,
  getCoursesForInstructors,
  getSingleCourse,
  getSingleCourseForInstructors,
} from "../controllers/course.controller";
import { Roles, authorizeRoles, isAuthenticated } from "@s7abab/common";

const router = express.Router();

router.post(
  "/create-course",
  isAuthenticated,
  authorizeRoles(Roles.INSTRUCTOR),
  createCourse
);

router.put("/edit-course", isAuthenticated, authorizeRoles(Roles.INSTRUCTOR));

router.delete(
  "/delete-course",
  isAuthenticated,
  authorizeRoles(Roles.INSTRUCTOR),
  deleteCourse
);

// public courses - everyone can access
router.get("/get-all-courses", getAllCourses);

router.get("/get-single-course/:courseId", getSingleCourse);

// only for instructors
router.get(
  "/get-courses-for-instructor",
  isAuthenticated,
  authorizeRoles(Roles.INSTRUCTOR),
  getCoursesForInstructors
);

router.get(
  "/get-course-for-instructor/:courseId",
  isAuthenticated,
  authorizeRoles(Roles.INSTRUCTOR),
  getSingleCourseForInstructors
);

router.post(
  "/add-lesson",
  isAuthenticated,
  authorizeRoles(Roles.INSTRUCTOR),
  addLesson
);

router.get("/get-lessons-for-instructors", isAuthenticated, authorizeRoles(Roles.INSTRUCTOR),)

export default router;
