import express from "express";
import {
  getEnrolledCourses,
} from "../controllers/enrollment.controller";
import { isAuthenticated } from "@s7abab/common";

const router = express.Router();


router.get("/enrolled-courses", isAuthenticated, getEnrolledCourses);

export default router;
