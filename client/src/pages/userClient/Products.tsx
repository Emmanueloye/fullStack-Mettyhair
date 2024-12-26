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
import { PageTypes, ProductTypes } from '../../dtos/productsDto';
import { useEffect, useState } from 'react';

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
  const [allProducts, setAllProducts] = useState<ProductTypes[]>([]);
  const [pages, setPages] = useState<PageTypes>();
  const dispatch = useAppDispatch();
  const { page, range, limit } = useLoaderData() as {
    page: number;
    range: string;
    limit: number;
  };

  // To alternate the url for product depending on filter for price
  let newURL: string;

  if (!range) {
    newURL = `/products?quantity[gt]=0&isActive=true&page=${
      page || 1
    }&limit=${limit}`;
  } else if (range?.includes('less')) {
    newURL = `/products?quantity[gt]=0&isActive=true&page=${
      page || 1
    }&limit=${limit}&sellingPrice[lte]=${range.split(',')[1]}`;
  } else if (range?.includes('above')) {
    newURL = `/products?quantity[gt]=0&isActive=true&page=${
      page || 1
    }&limit=${limit}&sellingPrice[gte]=${range.split(',')[1]}`;
  } else {
    newURL = `/products?quantity[gt]=0&isActive=true&page=${
      page || 1
    }&limit=${limit}&range=sellingPrice,${range}`;
  }

  const { data } = useQuery({
    queryKey: ['fetchProduct', 'products', page ?? 1, range],
    queryFn: () =>
      getData({
        url: newURL,
        // url: `/products?quantity[gt]=0&isActive=true&page=${page || 1}&limit=9`,
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

  useEffect(() => {
    setAllProducts(products);
    setPages({ totalPages, currentPage, nextPage, previousPage });
  }, [currentPage, data.page, nextPage, previousPage, products, totalPages]);

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
          <MainProduct products={allProducts} />
        </GridWrapper>
        {totalPages > 1 && (
          <Pagination
            totalPages={pages!.totalPages}
            currentPage={pages!.currentPage}
            nextPage={pages?.nextPage}
            previousPage={pages?.previousPage}
            pageLink='/products'
            marginTop='5rem'
          />
        )}
      </Container>
    </ProductSection>
  );
};

export default Products;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const params = extractParams(request);

  const { page, range } = params;
  const limit = 12;

  let newURL;

  if (!range) {
    newURL = `/products?quantity[gt]=0&isActive=true&page=${
      page || 1
    }&limit=${limit}`;
  } else if (range?.includes('less')) {
    newURL = `/products?quantity[gt]=0&isActive=true&page=${
      page || 1
    }&limit=${limit}&sellingPrice[lte]=${range.split(',')[1]}`;
  } else if (range?.includes('above')) {
    newURL = `/products?quantity[gt]=0&isActive=true&page=${
      page || 1
    }&limit=${limit}&sellingPrice[gte]=${range.split(',')[1]}`;
  } else {
    newURL = `/products?quantity[gt]=0&isActive=true&page=${
      page || 1
    }&limit=${limit}&range=sellingPrice,${range}`;
  }

  await queryClient.ensureQueryData({
    queryKey: ['fetchProduct', 'products', page ?? 1, range],
    queryFn: () =>
      getData({
        url: newURL,
        // url: `/products?quantity[gt]=0&isActive=true&page=${page || 1}&limit=9`,
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

  return { ...params, limit };
};
