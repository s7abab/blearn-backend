import express from "express";
import {
  createCategory,
  editCategory,
  getAllCategory,
  getSingleCategory,
  unlistCategory,
} from "../controllers/category.controller";
import { Roles, authorizeRoles, isAuthenticated } from "@s7abab/common";

const router = express.Router();

router.post(
  "/create-category",
  isAuthenticated,
  authorizeRoles(Roles.ADMIN),
  createCategory
);

router.put(
  "/edit-category",
  isAuthenticated,
  authorizeRoles(Roles.ADMIN),
  editCategory
);

router.put(
  "/unlist-category",
  isAuthenticated,
  authorizeRoles(Roles.ADMIN),
  unlistCategory
);

router.get("/get-all-category", getAllCategory);

router.get("/get-single-category/:categoryId", getSingleCategory);

export default router;
