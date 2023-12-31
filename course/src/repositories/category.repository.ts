import categoryModel from "../frameworks/models/category.model";
import { ICategory } from "../interfaces/category.interface";
import ICategoryRepository from "../interfaces/repository/category.repository";

class CategoryRepository implements ICategoryRepository {
  constructor() {}

  public async create(name: string): Promise<ICategory> {
    try {
      const category = await categoryModel.create({ name });
      return category;
    } catch (error) {
      throw error;
    }
  }

  public async findByIdAndUpdate(categoryId: string, name: string) {
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

  public async find() {
    try {
      const categories = await categoryModel.find();
      return categories;
    } catch (error) {
      throw error;
    }
  }

  public async findById(categoryId: string) {
    try {
      const category = await categoryModel.findById(categoryId);
      return category;
    } catch (error) {
      throw error;
    }
  }

  public async findByName(name: string) {
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
