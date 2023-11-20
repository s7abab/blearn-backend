import { catchAsyncError } from "@s7abab/common";
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "@s7abab/common/build/src/utils/ErrorHandler";
import categoryModel from "../models/category.model";
import { ICreateCategory, IEditCategory, IListCategory } from "../../@types/types";

export const createCategory = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body as ICreateCategory;
    if (name) {
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
        success:true,
        category
      })
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const listCategory = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { categoryId, isListed } = req.body as IListCategory;

    if (!categoryId || !isListed) {
      return next(
        new ErrorHandler("Invalid categoryId or isListed value provided", 400)
      );
    }
    const category = await categoryModel.findByIdAndUpdate(categoryId, {
      isListed,
    }, {new:true});

    res.status(200).json({
        success:true,
        category
    })
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
            if(categories){
                return next(new ErrorHandler("Categories not found", 404));
            }
        } catch (error:any) {
            return next(new ErrorHandler(error.message, 500))
        }
    })