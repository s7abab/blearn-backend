import express from "express";
import {
  createCategory,
  editCategory,
  getAllCategory,
  getSingleCategory,
  unlistCategory,
} from "../controllers/category.controller";
import { isAuthenticated } from "@s7abab/common";

const router = express.Router();

router.post("/create-category",isAuthenticated, createCategory);

router.put("/edit-category", editCategory);

router.put("/unlist-category", unlistCategory);

router.get("/get-all-category", getAllCategory);

router.get("/get-single-category/:categoryId", getSingleCategory);

export default router;
