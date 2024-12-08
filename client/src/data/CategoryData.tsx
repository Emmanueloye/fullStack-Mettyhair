import img from '../assets/images/hair.jpg';

export type CategoriesType = {
  image: string;
  category: string;
  text: string;
};

export const categories: CategoriesType[] = [
  {
    image: img,
    category: 'human hair',
    text: 'best quality at affordable prices',
  },
  {
    image: img,
    category: 'long length hair',
    text: 'best quality at affordable prices',
  },
  {
    image: img,
    category: 'Curly hair',
    text: 'best quality at affordable prices',
  },
  {
    image: img,
    category: 'Donor hair',
    text: 'best quality at affordable prices',
  },
];
