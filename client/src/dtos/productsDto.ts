export type ProductTypes = {
  _id: string;
  productName: string;
  slug: string;
  category: {
    _id: string;
    category: string;
  };
  subcategory: {
    _id: string;
    subcategory: string;
  };
  quantity: number;
  sellingPrice: number;
  discountPrice?: number;
  costPrice: number;
  color: string;
  size?: string;
  appearance?: string;
  productImage: string;
  productImagePublicId: string;
  thumbnails: string[];
  thumbnailsPublicId: string[];
  shortDesc: string;
  description: string;
  isActive: boolean;
  numOfReview?: number;
  averageRating?: number;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
  reviews: ReviewTypes[];
};

export type ReviewTypes = {
  _id: string;
  rating: number;
  review: string;
  product: string;
  user: {
    _id: string;
    fullName: string;
    photo: string;
    email: string;
  };
  isApproved: boolean;
  approvedBy: string;
  approvedDate: Date;
  createdAt: Date;
};

export type CartTypes = {
  _id: string;
  user: string;
  product: {
    _id: string;
    productName: string;
    productImage: string;
    sellingPrice: number;
    discountPrice: number;
    quantity: number;
    slug: string;
  };
  quantity: number;
  size: string;
  color: string;
};
