import { IEditCategory } from "../@types/category.types";
import categoryModel from "../models/category.model";

class CategoryRepository {
  constructor() {}

  async updateCategory({ categoryId, name }: IEditCategory) {
    try {
      const category = await categoryModel.findByIdAndUpdate(
        categoryId,
        { name },
        { new: true }
      );
      return category;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async createCategory(name: string) {
    try {
      const category = await categoryModel.create({ name });
      return category;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async findCategory() {
    try {
      const categories = await categoryModel.find();
      return categories;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async findCategoryById(categoryId: string) {
    try {
      const category = await categoryModel.findById(categoryId);
      return category;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async findCategoryByName(name: string) {
    try {
      const existingCategory = await categoryModel.findOne({
        name: { $regex: new RegExp(`^${name}$`, "i") },
      });
      return existingCategory;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async toggleCategoryListing(categoryId: string) {
    const category = await this.findCategoryById(categoryId);
    if (!category) {
      return null;
    }
    category.isListed = !category.isListed;
    try {
      await category.save();
    } catch (error: any) {
      throw new Error(error);
    }
  }
}

export default new CategoryRepository();
