import express, { NextFunction, Request, Response } from "express";
import { Roles, authorizeRoles, isAuthenticated } from "@s7abab/common";
import CategoryController from "../../controllers/category.controller";
import CategoryUsecase from "../../usecases/category.usecase";
import CategoryRepository from "../../repositories/category.repository";

const categoryRepository = new CategoryRepository();
const categoryService = new CategoryUsecase(categoryRepository);
const categoryController = new CategoryController(categoryService);

const router = express.Router();

router.post(
  "/create-category",
  isAuthenticated,
  authorizeRoles(Roles.ADMIN),
  (req: Request, res: Response, next: NextFunction) =>
    categoryController.createCategory(req, res, next)
);

router.put(
  "/edit-category",
  isAuthenticated,
  authorizeRoles(Roles.ADMIN),
  (req: Request, res: Response, next: NextFunction) =>
    categoryController.editCategory(req, res, next)
);

router.put(
  "/unlist-category",
  isAuthenticated,
  authorizeRoles(Roles.ADMIN),
  (req: Request, res: Response, next: NextFunction) =>
    categoryController.unlistCategory(req, res, next)
);

router.get(
  "/get-all-category",
  (req: Request, res: Response, next: NextFunction) =>
    categoryController.getAllCategories(req, res, next)
);

router.get(
  "/get-single-category/:categoryId",
  (req: Request, res: Response, next: NextFunction) =>
    categoryController.getSingleCategory(req, res, next)
);

export default router;
