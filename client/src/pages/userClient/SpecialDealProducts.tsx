/* eslint-disable react-refresh/only-export-components */
import styled from 'styled-components';
import MainProduct from '../../features/products/allProducts/MainProduct';
import ProductSideBar from '../../features/products/allProducts/ProductSideBar';
import Container from '../../ui/Container';
import { Header } from '../../features/authComponent/AuthStyles';
import Icon from '../../ui/Icon';
import { useAppDispatch } from '../../store/hook';
import { uiActions } from '../../store/uiSlice';
import { FaBarsStaggered } from 'react-icons/fa6';
import Pagination from '../../features/products/allProducts/Pagination';
import { extractParams, getData, queryClient } from '../../api/requests';
import { useQuery } from '@tanstack/react-query';
import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
import { ProductTypes } from '../../dtos/productsDto';

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

const SpecialDealProducts = () => {
  const dispatch = useAppDispatch();
  const { page } = useLoaderData() as { page: number };

  const { data } = useQuery({
    queryKey: ['fetchProduct', 'special', page ?? 1],
    queryFn: () =>
      getData({
        url: `/products?discountPrice[gt]=0&quantity[gt]=0&isActive=true&page=${
          page || 1
        }&limit=12`,
      }),
  });

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

  const { products }: { products: ProductTypes[] } = data;
  const { totalPages, currentPage, nextPage, previousPage } = data.page;

  return (
    <ProductSection>
      <Container>
        <Header $mb='3rem'>
          <h4>All Products</h4>
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
        {totalPages > 1 && data.noHits >= 12 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            nextPage={nextPage}
            previousPage={previousPage}
            pageLink='/products'
            marginTop='5rem'
          />
        )}
      </Container>
    </ProductSection>
  );
};

export default SpecialDealProducts;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const params = extractParams(request);
  // console.log(params);

  const { page } = params;
  await queryClient.ensureQueryData({
    queryKey: ['fetchProduct', 'special', page ?? 1],
    queryFn: () =>
      getData({
        url: `/products?discountPrice[gt]=0&quantity[gt]=0&isActive=true&page=${
          page || 1
        }&limit=12`,
      }),
  });

  await queryClient.ensureQueryData({
    queryKey: ['categories'],
    queryFn: () => getData({ url: `/categories?sort=createdAt` }),
  });

  await queryClient.ensureQueryData({
    queryKey: ['subcategories'],
    queryFn: () => getData({ url: `/subcategories?sort=createdAt` }),
  });

  return params;
};
