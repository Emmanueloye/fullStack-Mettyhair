/* eslint-disable react-refresh/only-export-components */
import { FaBarsStaggered } from 'react-icons/fa6';
import { Header } from '../../features/authComponent/AuthStyles';
import { useAppDispatch } from '../../store/hook';
import { uiActions } from '../../store/uiSlice';
import Container from '../../ui/Container';
import Icon from '../../ui/Icon';
import { GridWrapper, ProductSection } from './Products';
import ProductSideBar from '../../features/products/allProducts/ProductSideBar';
import MainProduct from '../../features/products/allProducts/MainProduct';
import Pagination from '../../features/products/allProducts/Pagination';
import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
import { extractParams, getData, queryClient } from '../../api/requests';
import { useQuery } from '@tanstack/react-query';
import { PageTypes, ProductTypes } from '../../dtos/productsDto';
import { useEffect, useState } from 'react';

const SubcategoriesProducts = () => {
  const [allProducts, setAllProducts] = useState<ProductTypes[]>([]);
  const [pages, setPages] = useState<PageTypes>();
  const dispatch = useAppDispatch();

  const { page, id, slug, range } = useLoaderData() as {
    page: number;
    id: string;
    slug: string;
    range: string;
  };

  let newURL;

  if (!range) {
    newURL = `/products?quantity[gt]=0&isActive=true&subcategory=${id}&page=${
      page || 1
    }&limit=12`;
  } else if (range?.includes('less')) {
    newURL = `/products?quantity[gt]=0&isActive=true&subcategory=${id}&page=${
      page || 1
    }&limit=12&sellingPrice[lte]=${range.split(',')[1]}`;
  } else if (range?.includes('above')) {
    newURL = `/products?quantity[gt]=0&isActive=true&subcategory=${id}&page=${
      page || 1
    }&limit=12&sellingPrice[gte]=${range.split(',')[1]}`;
  } else {
    newURL = `/products?quantity[gt]=0&isActive=true&subcategory=${id}&page=${
      page || 1
    }&limit=12&range=sellingPrice,${range}`;
  }

  const { data } = useQuery({
    queryKey: ['fetchProduct', 'products', page ?? 1, id, range],
    queryFn: () =>
      getData({
        url: newURL,
        // url: `/products?quantity[gt]=0&isActive=true&subcategory=${id}&page=${
        //   page || 1
        // }&limit=12`,
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
          <h4>Subcategory: {slug.split('-').join(' ')}</h4>
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
            pageLink={`/products/subcategory/${slug}/${id}`}
            marginTop='5rem'
          />
        )}
      </Container>
    </ProductSection>
  );
};

export default SubcategoriesProducts;

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const searchParams = extractParams(request);
  const { id, slug } = params;

  const { page, range } = searchParams;

  let newURL;

  if (!range) {
    newURL = `/products?quantity[gt]=0&isActive=true&subcategory=${id}&page=${
      page || 1
    }&limit=12`;
  } else if (range?.includes('less')) {
    newURL = `/products?quantity[gt]=0&isActive=true&subcategory=${id}&page=${
      page || 1
    }&limit=12&sellingPrice[lte]=${range.split(',')[1]}`;
  } else if (range?.includes('above')) {
    newURL = `/products?quantity[gt]=0&isActive=true&subcategory=${id}&page=${
      page || 1
    }&limit=12&sellingPrice[gte]=${range.split(',')[1]}`;
  } else {
    newURL = `/products?quantity[gt]=0&isActive=true&subcategory=${id}&page=${
      page || 1
    }&limit=12&range=sellingPrice,${range}`;
  }

  await queryClient.ensureQueryData({
    queryKey: ['fetchProduct', 'products', page ?? 1, id, range],
    queryFn: () =>
      getData({
        url: newURL,
        // url: `/products?quantity[gt]=0&isActive=true&subcategory=${id}&page=${
        //   page || 1
        // }&limit=12`,
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

  return { id, page, slug, range };
};
