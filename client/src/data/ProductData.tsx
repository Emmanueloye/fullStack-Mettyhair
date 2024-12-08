import img from '../assets/images/sliderimg.png';
import img1 from '../assets/images/hair.jpg';
import img2 from '../assets/images/nobgHair.png';
import img3 from '../assets/images/hair2.webp';

export type ProductType = {
  id: number;
  product: string;
  desc: string;
  img: string;
  discountPrice?: number;
  sellingPrice: number;
  thumbnails: string[];
  rating: number;
  numOfReview: number;
  quantity: number;
  color: string;
  size: string;
  isActive: boolean;
};

export const products: ProductType[] = [
  {
    id: 1,
    product: 'product 1 name is here already now',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veniam dicta libero deserunt consequatur eius earum in et error maiores sunt!',
    img: img,
    discountPrice: 300000,
    sellingPrice: 250000,
    thumbnails: [img1, img2, img],
    rating: 4,
    numOfReview: 6,
    quantity: 10,
    color: 'black',
    size: '20 inches',
    isActive: true,
  },
  {
    id: 2,
    product: 'product2 name is here',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veniam dicta libero deserunt consequatur eius earum in et error maiores sunt!',
    img: img2,
    discountPrice: 300000,
    sellingPrice: 250000,
    thumbnails: [img1, img2, img],
    rating: 3,
    numOfReview: 10,
    quantity: 5,
    color: 'blonde',
    size: '12 inches',
    isActive: true,
  },
  {
    id: 3,
    product: 'product3 name is here',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veniam dicta libero deserunt consequatur eius earum in et error maiores sunt!',
    img: img1,
    discountPrice: 400000,
    sellingPrice: 350000,
    thumbnails: [img1, img2, img],
    rating: 4.5,
    numOfReview: 4,
    quantity: 8,
    color: 'blue',
    size: '14 inches',
    isActive: true,
  },
  {
    id: 4,
    product: 'product4 name is here',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veniam dicta libero deserunt consequatur eius earum in et error maiores sunt!',
    img: img1,
    sellingPrice: 250000,
    thumbnails: [img1, img2, img],
    rating: 4,
    numOfReview: 6,
    quantity: 3,
    color: 'black',
    size: '20 inches',
    isActive: false,
  },
];

export type UserType = {
  id: number;
  fullName: string;
  email: string;
  image: string;
};

export const user = {
  id: 1,
  fullName: 'emmanuel oyediran',
  email: 'emmanuel@gmail.com',
  image: img3,
};
