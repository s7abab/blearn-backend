import express from "express";
import {
  blockUser,
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
  "/single-user/:id",
  isAuthenticated,
  authorizeRoles(Roles.ADMIN),
  getSingleUser
);

router.get(
  "/single-instructor/:id",
  isAuthenticated,
  authorizeRoles(Roles.ADMIN),
  getSingleInstructor
);

router.put(
  "/block-user/:id",
  isAuthenticated,
  authorizeRoles(Roles.ADMIN),
  blockUser
);

export default router;
