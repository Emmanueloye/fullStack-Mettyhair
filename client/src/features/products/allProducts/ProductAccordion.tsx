import { CategoriesType, SubcategoriesType } from '../../../dtos/categoriesDto';
import { NavLink } from 'react-router-dom';

const ProductAccordion = ({
  category,
  subcategories,
}: {
  category: CategoriesType;
  subcategories: SubcategoriesType[];
}) => {
  return (
    <ul className='section'>
      <h4>{category.category}</h4>
      {subcategories
        .filter((item) => item.category._id === category._id)
        .map((subcategory) => {
          return (
            <li key={subcategory._id}>
              <NavLink
                to={`/products/subcategory/${subcategory.slug}/${subcategory._id}`}
                className={({ isActive }) =>
                  isActive ? 'btn-list active' : 'btn-list'
                }
              >
                <span className={`sm-box`}></span>
                <span className={`btn-text`}>{subcategory.subcategory}</span>
              </NavLink>
            </li>
          );
        })}
    </ul>
  );
};

export default ProductAccordion;
