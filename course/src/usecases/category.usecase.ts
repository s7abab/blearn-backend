import { ICategory } from "../interfaces/category.interface";
import CategoryRepository from "../repositories/category.repository";

class CategoryUsecase {
  private categoryRepository: CategoryRepository;

  constructor(categoryRepository: CategoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  public async createCategory(name: string) {
    try {
      const existingCategory = await this.categoryRepository.findByName(name);
      if (existingCategory) {
        throw new Error("Category with the same name already exists");
      }

      const newCategory = await this.categoryRepository.create(name);

      if (!newCategory) {
        throw new Error("An error occurred while creating category");
      }

      return newCategory;
    } catch (error) {
      throw error;
    }
  }

  public async updateCategory(data: ICategory) {
    try {
      const existingCategory = await this.categoryRepository.findByName(
        data.name
      );
      if (existingCategory) {
        throw new Error("Category with the same name already exists");
      }
      if (!data.categoryId) {
        throw new Error("Category Id is empty");
      }
      const category = await this.categoryRepository.findByIdAndUpdate(
        data.categoryId,
        data.name
      );
      if (!category) {
        throw new Error("An error occured while updating category");
      }
      return category;
    } catch (error: any) {
      throw error;
    }
  }

  public async getCategories() {
    try {
      const categories = await this.categoryRepository.find();
      return categories;
    } catch (error) {
      throw error;
    }
  }

  public async getOneCategory(categoryId: string) {
    try {
      const category = await this.categoryRepository.findById(categoryId);
      if (!category) {
        throw new Error("Category not found");
      }
      return category;
    } catch (error) {
      throw error;
    }
  }

  public async toggleCategoryListing(categoryId: string) {
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throw new Error("Category not found");
    }
    category.isListed = !category.isListed;
    try {
      await category.save();
    } catch (error: any) {
      throw new Error(error);
    }
  }
}

export default CategoryUsecase;
