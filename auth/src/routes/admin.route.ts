import express from "express";
import {
  getInstructors,
  getSingleInstructor,
  getSingleUser,
  getUsers,
} from "../controllers/admin.controller";
import { Roles, authorizeRoles, isAuthenticated } from "@s7abab/common";

const router = express.Router();

router.get("/users", getUsers);

router.get(
  "/instructors",
  isAuthenticated,
  authorizeRoles(Roles.ADMIN),
  getInstructors
);

router.get(
  "/single-user",
  isAuthenticated,
  authorizeRoles(Roles.ADMIN),
  getSingleUser
);

router.get(
  "/single-instructor",
  isAuthenticated,
  authorizeRoles(Roles.ADMIN),
  getSingleInstructor
);

export default router;
