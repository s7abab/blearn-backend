import express from "express";
import {
  createCourse,
  deleteCourse,
  getAllCourses,
  getSingleCourse,
} from "../controllers/course.controller";
import { isAuthenticated } from "@s7abab/common";

const router = express.Router();

router.post("/create-course", createCourse);

router.put("/edit-course");

router.delete("/delete-course", isAuthenticated, deleteCourse);

router.get("/get-all-courses", getAllCourses);

router.get("/get-single-course/:courseId", getSingleCourse);

export default router;
