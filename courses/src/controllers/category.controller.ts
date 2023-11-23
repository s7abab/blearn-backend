import { catchAsyncError } from "@s7abab/common";
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "@s7abab/common/build/src/utils/ErrorHandler";
import categoryModel from "../models/category.model";
import { ICategoryId, ICreateCategory, IEditCategory } from "../@types/types";
import { validateCategoryName } from "../utils/validations/category.validation";

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
      const category = await categoryModel.create({ name });
      res.status(201).json({
        success: true,
        category,
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
      const category = await categoryModel.findByIdAndUpdate(
        categoryId,
        { name },
        { new: true }
      );

      res.status(200).json({
        success: true,
        category,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const unlistCategory = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { categoryId } = req.body as ICategoryId;
    if (!categoryId) {
      return next(
        new ErrorHandler("Invalid categoryId or isListed value provided", 400)
      );
    }
    const category = await categoryModel.findById(categoryId);

    if (!category) {
      return next(new ErrorHandler("Category not found", 404));
    }

    category.isListed = !category.isListed;
    await category.save();

    res.status(200).json({
      success: true,
      category,
    });
    try {
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const getAllCategory = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await categoryModel.find();
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
      const category = await categoryModel.findById(categoryId);
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
