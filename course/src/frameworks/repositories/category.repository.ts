import categoryModel from "../models/category.model";
import { ICategory } from "../../@types/category.types";
import ICategoryRepository from "../../usecases/interfaces/repository/category.repository";

class CategoryRepository implements ICategoryRepository {
  constructor() {}

  async create(name: string): Promise<ICategory> {
    try {
      const category = await categoryModel.create({ name });
      return category;
    } catch (error) {
      throw error;
    }
  }

  async findByIdAndUpdate(categoryId: string, name: string) {
    try {
      const category = await categoryModel.findByIdAndUpdate(
        categoryId,
        { name },
        { new: true }
      );
      return category;
    } catch (error) {
      throw error;
    }
  }

  async find() {
    try {
      const categories = await categoryModel.find();
      return categories;
    } catch (error) {
      throw error;
    }
  }

  async findById(categoryId: string) {
    try {
      const category = await categoryModel.findById(categoryId);
      return category;
    } catch (error) {
      throw error;
    }
  }

  async findByName(name: string) {
    try {
      const regexPattern = new RegExp(`^${name}$`, "i");
      // Find a category matching the name using the case-insensitive regex
      const category = await categoryModel.findOne({
        name: { $regex: regexPattern },
      });
      return category;
    } catch (error) {
      throw error;
    }
  }
}

export default CategoryRepository;
