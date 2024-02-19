import { ICategory } from "../category.interface";


interface ICategoryRepository {
  create(name: string): Promise<ICategory>;
  findByIdAndUpdate(
    categoryId: string,
    name: string
  ): Promise<ICategory | null>;
  find(): Promise<ICategory[]>;
  findById(categoryId: string): Promise<ICategory | null>;
  findByName(name: string): Promise<ICategory | null>;
}

export default ICategoryRepository;
