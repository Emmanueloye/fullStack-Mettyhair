/* eslint-disable react-refresh/only-export-components */
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
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ProductTypes } from '../../../dtos/productsDto';
import { useEffect, useState } from 'react';
import {
  LoaderFunctionArgs,
  useLoaderData,
  useSearchParams,
} from 'react-router-dom';
import {
  extractParams,
  getData,
  getOnlyData,
  queryClient,
} from '../../../api/requests';
import { sortParamsSetting } from '../../../utilities/productSorting';
import { NUM_OF_HITS } from '../../../utilities/constant';

const StockoutNotice = () => {
  const queryClientHook = useQueryClient();
  const [allProducts, setAllProducts] = useState<ProductTypes[]>([]);
  const [searchField, setSearchField] = useState('productName');
  const [searchValue, setSearchValue] = useState('');
  const { page, sort, reOderLevel } = useLoaderData() as {
    page: number;
    sort: string;
    reOderLevel: number;
  };
  const [sortParams, setSortParams] = useSearchParams();

  const { data } = useQuery({
    queryKey: [
      'fetchProduct',
      'stockout',
      page ?? 1,
      sort ?? '-createdAt',
      reOderLevel,
    ],
    queryFn: () =>
      getData({
        url: `/products?quantity[lte]=${reOderLevel}&page=${page || 1}&sort=${
          sort || '-createdAt'
        }`,
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
    let timeOut: NodeJS.Timeout;
    const filterData = async () => {
      let newUrl = `/products?quantity[lte]=${reOderLevel}&search=${encodeURIComponent(
        searchField
      )}&value=${encodeURIComponent(searchValue)}`;
      if (searchField !== 'productName') {
        newUrl = `/products?quantity[lte]=${encodeURIComponent(
          reOderLevel
        )}&${encodeURIComponent(searchField)}=${encodeURIComponent(
          searchValue
        )}`;
      }
      timeOut = setTimeout(async () => {
        const resp = queryClientHook.fetchQuery({
          queryKey: [
            'fetchProduct',
            'stockoutProduct',
            searchValue,
            reOderLevel,
          ],
          queryFn: () => getData({ url: newUrl }),
        });

        const data = await resp;

        if (encodeURIComponent(searchValue)) {
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
        <h4>Near stockout products</h4>
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
            {totalPages > 1 && data.noHits > NUM_OF_HITS && (
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                nextPage={nextPage}
                previousPage={previousPage}
                pageLink='/admin/products'
                marginTop='2rem'
              />
            )}
          </>
        ) : (
          <Empty
            message='No risk of stockout for now. Please come back when the stockout warning on the dashboard is greater than zero.'
            showLink={false}
            type='dark'
          />
        )}
      </AdminBox>
    </AdminSection>
  );
};

export default StockoutNotice;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const params = extractParams(request);
  const { page, sort } = params;

  const resp = await queryClient.ensureQueryData({
    queryKey: ['setting'],
    queryFn: () => getOnlyData({ url: '/settings' }),
  });

  const reOderLevel = resp.settings[0]?.reorderLevel;

  await queryClient.ensureQueryData({
    queryKey: [
      'fetchProduct',
      'stockout',
      page ?? 1,
      sort ?? '-createdAt',
      reOderLevel,
    ],
    queryFn: () =>
      getData({
        url: `/products?quantity[lte]=${reOderLevel}&page=${page || 1}&sort=${
          sort || '-createdAt'
        }`,
      }),
  });

  return { ...params, reOderLevel };
};
