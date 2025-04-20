/* eslint-disable react-refresh/only-export-components */
import {
  ActionFunctionArgs,
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
import { Table, TableRow } from '../../../ui/Table';
import Pagination from '../../../features/products/allProducts/Pagination';
import ActionsBtns from '../../../features/adminActions/ActionsBtns';
import Empty from '../../../ui/Empty';
import { formatNumber } from '../../../utilities/HelperFunc';
import { FaCheck, FaTimes } from 'react-icons/fa';
import AppTableSearch from '../../../ui/AppTableSearch';
import {
  deleteData,
  extractFormData,
  extractParams,
  getData,
  queryClient,
  updateData,
} from '../../../api/requests';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ProductTypes } from '../../../dtos/productsDto';
import { useEffect, useState } from 'react';
import { sortParamsSetting } from '../../../utilities/productSorting';

// import TableV2 from '../../../ui/TableV2';

const AdminProducts = () => {
  const queryClientHook = useQueryClient();
  const [allProducts, setAllProducts] = useState<ProductTypes[]>([]);
  const [searchField, setSearchField] = useState('productName');
  const [searchValue, setSearchValue] = useState('');
  const { page, sort } = useLoaderData() as { page: number; sort: string };
  const [sortParams, setSortParams] = useSearchParams();

  const { data } = useQuery({
    queryKey: [
      'fetchProduct',
      'Adminproducts',
      page ?? 1,
      sort ?? '-createdAt',
    ],
    queryFn: () =>
      getData({
        url: `/products?page=${page || 1}&sort=${sort || '-createdAt'}`,
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
      let newUrl = `/products?search=${encodeURIComponent(
        searchField
      )}&value=${encodeURIComponent(searchValue)}`;
      if (searchField !== 'productName') {
        newUrl = `/products?${searchField}=${searchValue}`;
      }
      timeOut = setTimeout(async () => {
        const resp = queryClientHook.fetchQuery({
          queryKey: ['fetchProduct', 'Adminproducts', searchValue],
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

  // Table config
  const headers = [
    'image',
    'product',
    'quantity',
    'price',
    'WS Price',
    'discount',
    'status',
    'action',
  ];
  const column = '0.6fr 1.7fr .4fr 1fr 1fr .6fr .3fr 1.8fr';
  return (
    <>
      <AdminSection>
        {/* Header */}
        <AdminHeader>
          <h4>Manage Products</h4>
          <Link to='/admin/products/add'>New product</Link>
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
                      className='rounded-img'
                    />
                    <p>{product.productName}</p>
                    <p>{product.quantity}</p>
                    <p> &#8358;{formatNumber(product.sellingPrice)} </p>
                    <p>
                      {' '}
                      &#8358;
                      {product.wholeSalerPrice
                        ? formatNumber(product.wholeSalerPrice)
                        : '0.00'}{' '}
                    </p>
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

                    <ActionsBtns
                      showActivation={true}
                      editURL={`/admin/products/edit/${product._id}`}
                      viewURL={`/admin/products/view/${product._id}`}
                      isActive={product.isActive}
                      id={product._id}
                    />
                  </TableRow>
                ))}
              </Table>
              {totalPages > 1 && (
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
              message={'No product is not available'}
              showLink={false}
              type='dark'
            />
          )}
        </AdminBox>
      </AdminSection>
    </>
  );
};

export default AdminProducts;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const params = extractParams(request);
  const { page, sort } = params;
  await queryClient.ensureQueryData({
    queryKey: [
      'fetchProduct',
      'Adminproducts',
      page ?? 1,
      sort ?? '-createdAt',
    ],
    queryFn: () =>
      getData({
        url: `/products?page=${page || 1}&sort=${sort || '-createdAt'}`,
      }),
  });

  return params;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { id, ...data } = await extractFormData(request);
  if (request.method === 'PATCH') {
    return updateData({
      url: `/products/${id}`,
      data,
      // redirectTo: '/admin/products',
      setToast: true,
      invalidate: ['fetchProduct'],
    });
  }

  if (request.method === 'DELETE') {
    return deleteData({
      url: `/products/${id}`,
      redirectTo: '/admin/products',
      invalidate: ['fetchProduct'],
    });
  }
};
