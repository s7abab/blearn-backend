import { ICategory } from "../category.interface";

interface ICategoryUsecase {
    createCategory(name: string): Promise<Document | null>;
    updateCategory(data: ICategory): Promise<Document | null>;
    getCategories(): Promise<Document[]>;
    getOneCategory(categoryId: string): Promise<Document | null>;
    toggleCategoryListing(categoryId: string): Promise<void>;
  }

export default ICategoryUsecase