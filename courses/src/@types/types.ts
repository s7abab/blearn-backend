export interface ICourseRequestData {
  title: string;
  category: string;
  demoUrl: string;
  description: string;
  thumbnail: string;
  preview: string;
  price: string;
  discountPrice: string;
}

export interface ICreateCategory {
  name: string;
}

export interface IEditCategory {
  categoryId: string;
  name: string;
}

export interface IListCategory {
  categoryId: string;
  isListed: boolean;
}
