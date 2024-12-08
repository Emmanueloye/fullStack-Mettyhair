export type SliderTypes = {
  _id: string;
  title: string;
  description: string;
  image: string;
  imagePublicId: string;
  createdAt: Date;
  isActive: boolean;
  createdBy: {
    id: string;
    fullName: string;
  };
  updatedAt?: Date;
  updatedBy?: {
    id: string;
    fullName: string;
  };
};
