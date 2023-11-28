import express from "express";
import {
  createCourse,
  deleteCourse,
  getAllCourses,
  getSingleCourse,
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

router.get("/get-all-courses", getAllCourses);

router.get("/get-single-course/:courseId", getSingleCourse);

export default router;
