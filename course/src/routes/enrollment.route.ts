import express from "express";
import {
  createEnrollment,
  getEnrolledCourses,
} from "../controllers/enrollment.controller";
import { isAuthenticated } from "@s7abab/common";

const router = express.Router();

router.post("/create-enrollment", isAuthenticated, createEnrollment);

router.get("/enrolled-courses", isAuthenticated, getEnrolledCourses);

export default router;
