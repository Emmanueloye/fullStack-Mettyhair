/* eslint-disable react-refresh/only-export-components */
import styled from 'styled-components';
import MainProduct from '../../features/products/allProducts/MainProduct';
import ProductSideBar from '../../features/products/allProducts/ProductSideBar';
import Container from '../../ui/Container';
import { Header } from '../../features/authComponent/AuthStyles';
import Icon from '../../ui/Icon';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { uiActions } from '../../store/uiSlice';
import { FaBarsStaggered } from 'react-icons/fa6';
import { useQuery } from '@tanstack/react-query';
import { getData, queryClient } from '../../api/requests';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const GridWrapper = styled.div`
  position: relative;

  @media screen and (min-width: 1024px) {
    display: grid;
    grid-template-columns: 0.7fr 2fr;
    gap: 1.8rem;
    min-height: 0;
  }
`;

export const ProductSection = styled.section`
  padding-top: 8rem;
  position: relative;

  .sidebar-toggle {
    margin-left: 3rem;
    margin-bottom: 2rem;

    cursor: pointer;
    z-index: 10;
  }

  @media screen and (min-width: 1024px) {
    .sidebar-toggle {
      display: none;
    }
  }
  @media screen and (max-width: 270px) {
    .sidebar-toggle {
      top: 50%;
    }
  }
`;

const Products = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { products } = useAppSelector((state) => state.search);

  useEffect(() => {
    if (products.length === 0) {
      navigate('/');
      // toast.error('Use the search button to search for products.');
    }
  }, [navigate, products.length]);

  const {
    data: { categories },
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getData({ url: `/categories?sort=createdAt` }),
  });

  const {
    data: { subcategories },
  } = useQuery({
    queryKey: ['subcategories'],
    queryFn: () => getData({ url: `/subcategories?sort=createdAt` }),
  });

  return (
    <ProductSection>
      <Container>
        <Header $mb='3rem'>
          <h4>Search Results</h4>
        </Header>
        {/* Sidebar toggle */}
        <div
          className='sidebar-toggle'
          onClick={() => dispatch(uiActions.openSideBar())}
        >
          <Icon
            icon={<FaBarsStaggered />}
            iconSize='3rem'
            color='var(--primary-color)'
            text='Filter'
          />
        </div>
        <GridWrapper>
          {/* Sidebar */}
          <ProductSideBar
            categories={categories}
            subcategories={subcategories}
          />
          {/* Main product grid */}
          <MainProduct products={products} />
        </GridWrapper>
      </Container>
    </ProductSection>
  );
};

export default Products;

export const loader = async () => {
  await queryClient.ensureQueryData({
    queryKey: ['categories'],
    queryFn: () => getData({ url: `/categories?sort=createdAt` }),
  });

  await queryClient.ensureQueryData({
    queryKey: ['subcategories'],
    queryFn: () => getData({ url: `/subcategories?sort=createdAt` }),
  });

  return null;
};
