import express from "express";
import {
  addLesson,
  addModule,
  createCourse,
  deleteCourse,
  deleteModule,
  editCourse,
  editModule,
  getAllCourses,
  getCoursesForInstructors,
  getLessonsForInstructor,
  getModules,
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

router.put("/edit-course", isAuthenticated, authorizeRoles(Roles.INSTRUCTOR), editCourse);

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
  "/add-module",
  isAuthenticated,
  authorizeRoles(Roles.INSTRUCTOR),
  addModule
);

router.put(
  "/edit-module",
  isAuthenticated,
  authorizeRoles(Roles.INSTRUCTOR),
  editModule
);

router.delete(
  "/delete-module",
  isAuthenticated,
  authorizeRoles(Roles.INSTRUCTOR),
  deleteModule
);

router.get(
  "/get-modules/:courseId",
  isAuthenticated,
  authorizeRoles(Roles.INSTRUCTOR),
  getModules
);

router.post(
  "/add-lesson",
  isAuthenticated,
  authorizeRoles(Roles.INSTRUCTOR),
  addLesson
);

router.get(
  "/get-lessons-for-instructors",
  isAuthenticated,
  authorizeRoles(Roles.INSTRUCTOR),
  getLessonsForInstructor
);

export default router;
