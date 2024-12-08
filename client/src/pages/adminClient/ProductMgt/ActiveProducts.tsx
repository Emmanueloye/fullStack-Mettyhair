/* eslint-disable react-refresh/only-export-components */
import {
  Link,
  LoaderFunctionArgs,
  useLoaderData,
  useSearchParams,
} from 'react-router-dom';
import {
  AdminBox,
  AdminHeader,
  AdminSection,
  Status,
} from '../../../features/adminNavLayouts/AdminUtils';
import AppTableSearch from '../../../ui/AppTableSearch';
import { Table, TableRow } from '../../../ui/Table';
import { formatNumber } from '../../../utilities/HelperFunc';
import { FaCheck, FaTimes } from 'react-icons/fa';
import Pagination from '../../../features/products/allProducts/Pagination';
import Empty from '../../../ui/Empty';
import { extractParams, getData, queryClient } from '../../../api/requests';
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ProductTypes } from '../../../dtos/productsDto';
import { sortParamsSetting } from '../../../utilities/productSorting';
import { NUM_OF_HITS } from '../../../utilities/constant';

const ActiveProducts = () => {
  const queryClientHook = useQueryClient();
  const [allProducts, setAllProducts] = useState<ProductTypes[]>([]);
  const [searchField, setSearchField] = useState('productName');
  const [searchValue, setSearchValue] = useState('');
  const { page, sort } = useLoaderData() as { page: number; sort: string };
  const [sortParams, setSortParams] = useSearchParams();

  const { data } = useQuery({
    queryKey: ['fetchProduct', 'active', page ?? 1, sort ?? '-createdAt'],
    queryFn: () =>
      getData({
        url: `/products?page=${page || 1}&sort=${
          sort || '-createdAt'
        }&isActive=true`,
      }),
  });

  const { products }: { products: ProductTypes[] } = data || {};

  const { totalPages, currentPage, nextPage, previousPage } = data.page;

  useEffect(() => {
    setAllProducts(products);
  }, [products]);

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortValue = sortParamsSetting(e);

    sortParams.set('sort', sortValue as string);
    setSortParams(sortParams);
  };

  const handleSearchField = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchField(e.target.value);
  };

  // get users based on the searchfield set in setSearch and the keyword typed into the search value input field.
  const handleSearchValue = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    let timeOut: number | undefined;
    const filterData = async () => {
      let newUrl = `/products?isActive=true&search=${searchField}&value=${searchValue}`;
      if (searchField !== 'productName') {
        newUrl = `/products?isActive=true&${searchField}=${searchValue}`;
      }
      timeOut = setTimeout(async () => {
        const resp = queryClientHook.fetchQuery({
          queryKey: ['fetchProduct', 'activeProduct', searchValue],
          queryFn: () => getData({ url: newUrl }),
        });

        const data = await resp;

        if (searchValue) {
          setAllProducts(data.products);
        } else {
          setAllProducts(products);
        }
      }, 1000);
    };

    filterData();
    return () => {
      clearTimeout(timeOut);
    };
  }, [products, searchValue]);

  const headers = [
    'image',
    'product',
    'quantity',
    'price',
    'discount',
    'status',
  ];
  const column = '0.3fr 1.7fr 1fr 1fr 1fr 1fr';
  return (
    <AdminSection>
      {/* Header */}
      <AdminHeader>
        <h4>active Products</h4>
        <Link to='/admin/inactive-products'>inactive products</Link>
      </AdminHeader>
      {/* Table search */}
      <AppTableSearch
        searchOptions={[
          'product name',
          'quantity',
          'selling price',
          'discount price',
        ]}
        sortOptions={[
          'old to new',
          'new to old',
          'A-Z: Product',
          'Z-A: Product',
          'accending: Price',
          'decending: Price',
          'accending: quantity',
          'decending: quantity',
        ]}
        dark={true}
        bg='var(--admin-input-bg)'
        onSort={handleSort}
        onSearchField={handleSearchField}
        onSearchValue={handleSearchValue}
      />
      {/* Table */}
      <AdminBox>
        {allProducts?.length > 0 ? (
          <>
            <Table headers={headers} column={column}>
              {allProducts.map((product) => (
                <TableRow $column={column} key={product._id}>
                  <img
                    src={product.productImage}
                    alt={product.productName}
                    width={40}
                    height={40}
                  />
                  <p>{product.productName}</p>
                  <p>{product.quantity}</p>
                  <p> &#8358;{formatNumber(product.sellingPrice)} </p>
                  <p>
                    &#8358;
                    {product.discountPrice
                      ? formatNumber(product.discountPrice)
                      : '0.00'}
                  </p>
                  <p>
                    {product.isActive ? (
                      <Status $isActive={product.isActive}>
                        <FaCheck />
                      </Status>
                    ) : (
                      <Status>
                        <FaTimes />
                      </Status>
                    )}
                  </p>
                </TableRow>
              ))}
            </Table>
            {totalPages > 1 && data.noHits >= NUM_OF_HITS && (
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                nextPage={nextPage}
                previousPage={previousPage}
                pageLink='/admin/active-products'
                marginTop='2rem'
              />
            )}
          </>
        ) : (
          <Empty
            message='No inactive products available'
            showLink={false}
            type='dark'
          />
        )}
      </AdminBox>
    </AdminSection>
  );
};

export default ActiveProducts;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const params = extractParams(request);
  const { page, sort } = params;
  await queryClient.ensureQueryData({
    queryKey: ['fetchProduct', 'active', page ?? 1, sort ?? '-createdAt'],
    queryFn: () =>
      getData({
        url: `/products?page=${page || 1}&sort=${
          sort || '-createdAt'
        }&isActive=true`,
      }),
  });

  return params;
};
