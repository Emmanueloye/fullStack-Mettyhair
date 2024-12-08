// import Input from '../../../ui/Input';
// import { FormGroup } from '../../authComponent/AuthStyles';
import { FaRegTimesCircle } from 'react-icons/fa';
import AsideWrapper from './ProductSideBarStyles';
import PriceFilter from './PriceFilter';
import { useAppDispatch, useAppSelector } from '../../../store/hook';
import { uiActions } from '../../../store/uiSlice';
import { CategoriesType, SubcategoriesType } from '../../../dtos/categoriesDto';
import ProductAccordion from './ProductAccordion';

const ProductSideBar = ({
  categories,
  subcategories,
}: {
  categories: CategoriesType[];
  subcategories: SubcategoriesType[];
}) => {
  // const [index, setIndex] = useState(0);
  const dispatch = useAppDispatch();

  const { isSidebarOpen } = useAppSelector((state) => state.ui);

  return (
    <AsideWrapper $isOpen={isSidebarOpen}>
      <div
        className='close-btn'
        onClick={() => dispatch(uiActions.closeSideBar())}
      >
        <FaRegTimesCircle />
      </div>

      {/* Search */}
      {/* <FormGroup>
        <Input type='text' placeholder='Search...' />
        <button className='btn'>
          <FaSearch />
        </button>
      </FormGroup> */}
      {/* Categories filter */}
      {categories.map((category) => (
        <ProductAccordion
          key={category._id}
          category={category}
          subcategories={subcategories}
        />
      ))}
      <PriceFilter />
    </AsideWrapper>
  );
};

export default ProductSideBar;
