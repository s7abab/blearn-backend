import { catchAsyncError } from "@s7abab/common";
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "@s7abab/common/build/src/utils/ErrorHandler";
import categoryModel from "../models/category.model";
import {
  ICategoryId,
  ICreateCategory,
  IEditCategory,
} from "../@types/category.types";
import { validateCategoryName } from "../utils/validations/category.validation";
import CategoryRepository from "../repositories/category.repository";

export const createCategory = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body as ICreateCategory;
    if (!validateCategoryName({ name })) {
      return next(new ErrorHandler("Invalid inputs", 400));
    }
    if (!name) {
      return next(new ErrorHandler("Invalid name", 400));
    }
    try {
      const existingCategory = await CategoryRepository.findCategoryByName(name);

      if (existingCategory) {
        return next(
          new ErrorHandler("Category with the same name already exists", 400)
        );
      }
      const category = await CategoryRepository.createCategory(name);
      res.status(201).json({
        success: true,
        message: "Category created successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const editCategory = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, categoryId } = req.body as IEditCategory;
    try {
      if (!validateCategoryName({ name })) {
        return next(new ErrorHandler("Invalid inputs", 400));
      }

      if (!name || !categoryId) {
        return next(
          new ErrorHandler("Invalid name or categoryId provided", 400)
        );
      }

      const existingCategory = await CategoryRepository.findCategoryByName(name);
      if (existingCategory) {
        return next(
          new ErrorHandler("Category with the same name already exists", 409)
        );
      }

      await CategoryRepository.updateCategory({
        categoryId,
        name,
      });

      res.status(200).json({
        success: true,
        message: "Category edited successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const unlistCategory = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { categoryId } = req.body as ICategoryId;
    try {
      if (!categoryId) {
        return next(
          new ErrorHandler("Invalid categoryId or isListed value provided", 400)
        );
      }
      const category = await CategoryRepository.findCategoryById(categoryId);

      if (!category) {
        return next(new ErrorHandler("Category not found", 404));
      }

      await CategoryRepository.toggleCategoryListing(categoryId);

      res.status(200).json({
        success: true,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const getAllCategory = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await CategoryRepository.findCategory();
      if (!categories) {
        return next(new ErrorHandler("Categories not found", 404));
      }
      res.status(200).json({
        success: true,
        categories,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
export const getSingleCategory = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { categoryId } = req.params;
    try {
      const category = await CategoryRepository.findCategoryById(categoryId)
      if (!category) {
        return next(new ErrorHandler("Categories not found", 404));
      }
      res.status(200).json({
        success: true,
        category,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
