import express from "express";
import { isAuthenticated } from "@s7abab/common";
import { getEntrolledCourses } from "../controllers/user.controller";

const router = express.Router();


router.post("/enrolled-courses", getEntrolledCourses );

export default router;
