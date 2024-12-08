export type CategoriesType = {
  _id: string;
  category: string;
  slug: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  photo: string;
};

export type SubcategoriesType = {
  _id: string;
  subcategory: string;
  slug: string;
  category: { _id: string; category: string };
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  isActive: boolean;
};
