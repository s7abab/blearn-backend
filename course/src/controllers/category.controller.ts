import { Request, Response, NextFunction } from "express";
import ErrorHandler from "@s7abab/common/build/src/utils/ErrorHandler";
import CategoryService from "../usecases/category.usecase";
import { validateCategoryName } from "../frameworks/utils/validations/category.validation";
import { isEmpty } from "../frameworks/utils/validations/common.validation";
import { ICategory } from "../interfaces/category.interface";

class CategoryController {
  private categoryService: CategoryService;

  constructor(categoryService: CategoryService) {
    this.categoryService = categoryService;
  }

  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body as ICategory;

      if (!name || !validateCategoryName({ name })) {
        return next(new ErrorHandler("Invalid inputs", 400));
      }

      const category = await this.categoryService.createCategory(name);

      res.status(201).json({
        success: true,
        message: "Category created successfully",
        category,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  async editCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, categoryId } = req.body;

      if (isEmpty(name) || isEmpty(categoryId)) {
        return next(new ErrorHandler("Invalid category data", 400));
      }
      await this.categoryService.updateCategory({
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

  async unlistCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { categoryId }: { categoryId: string } = req.body;

      if (!categoryId) {
        return next(new ErrorHandler("Invalid categoryId provided", 400));
      }

      await this.categoryService.toggleCategoryListing(categoryId);

      res.status(200).json({
        success: true,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  async getAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await this.categoryService.getCategories();

      res.status(200).json({
        success: true,
        categories,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  async getSingleCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { categoryId } = req.params;
      const category = await this.categoryService.getOneCategory(categoryId);

      res.status(200).json({
        success: true,
        category,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
}

export default CategoryController;
