import { Link } from 'react-router-dom';
import { CategoriesType, SubcategoriesType } from '../../../dtos/categoriesDto';
import { NavLink } from 'react-router-dom';
import { slugifyText } from '../../../utilities/HelperFunc';

const ProductAccordion = ({
  category,
  subcategories,
}: {
  category: CategoriesType;
  subcategories: SubcategoriesType[];
}) => {
  return (
    <ul className='section'>
      <Link
        to={`/products/category/${slugifyText(category.category)}/${
          category._id
        }`}
      >
        <h4>{category.category}</h4>
      </Link>
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
