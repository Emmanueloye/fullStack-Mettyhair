import { IoSearch } from 'react-icons/io5';
import Icon from './Icon';
import { MdOutlineShoppingBag } from 'react-icons/md';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../store/hook';
import { uiActions } from '../store/uiSlice';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  .cart {
    position: relative;
    .badge {
      color: var(--secondary-text-white);
      font-weight: 600;
      position: absolute;
      top: -0.6rem;
      right: 0.8rem;
    }
  }
`;

const CartAndSearch = ({ cartQty = 0, className = '' }) => {
  const dispatch = useAppDispatch();
  return (
    <Wrapper className={className}>
      <div>
        <Icon
          icon={<IoSearch />}
          iconSize='2rem'
          space='2rem'
          openModal={() => dispatch(uiActions.openModal())}
        />
      </div>
      <Link to='/shopping-cart' className='cart'>
        <Icon icon={<MdOutlineShoppingBag />} iconSize='2rem' />
        <span className='badge'>{cartQty}</span>
      </Link>
    </Wrapper>
  );
};

export default CartAndSearch;
