import { useAppSelector } from '../../store/hook';
import {
  ArticleBox,
  ColThree,
  ColTwo,
  ImageBox,
  MenuWrapper,
} from './MegaMenuStyles';
import { Link } from 'react-router-dom';
import { CategoriesType, SubcategoriesType } from '../../dtos/categoriesDto';

const MegaMenu = ({
  categories,
  subcategories,
}: {
  categories: CategoriesType[];
  subcategories: SubcategoriesType[];
}) => {
  // console.log(subcategories);

  const { isSubmenuOpen } = useAppSelector((state) => state.ui);
  return (
    <MenuWrapper $show={isSubmenuOpen} className='product-tab'>
      <ColTwo className='product-tab'>
        <ColThree className='product-tab'>
          {categories?.map((category) => (
            <ArticleBox className='product-tab' key={category._id}>
              <Link
                to={`/products/category/${category.slug}/${category._id}`}
                className='title product-tab'
              >
                {category.category}
              </Link>
              <ul className='submenu-links product-tab'>
                {subcategories
                  ?.filter((item) => item.category._id === category._id)
                  ?.map((subcategory) => (
                    <li key={subcategory._id}>
                      <Link
                        to={`/products/subcategory/${subcategory.slug}/${subcategory._id}`}
                        className='product-tab'
                      >
                        {subcategory.subcategory}
                      </Link>
                    </li>
                  ))}
              </ul>
            </ArticleBox>
          ))}
        </ColThree>
        <ImageBox>
          <img
            src={categories?.[0]?.photo}
            alt='product image'
            width='100%'
            height={200}
            className='product-tab'
          />
        </ImageBox>
      </ColTwo>
    </MenuWrapper>
  );
};

export default MegaMenu;
