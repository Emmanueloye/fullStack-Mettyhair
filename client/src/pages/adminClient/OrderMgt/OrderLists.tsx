/* eslint-disable react-refresh/only-export-components */
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  useLoaderData,
  useLocation,
  useSearchParams,
} from 'react-router-dom';
import {
  AdminBox,
  AdminHeader,
  AdminSection,
} from '../../../features/adminNavLayouts/AdminUtils';
import AppTableSearch from '../../../ui/AppTableSearch';
import { Table, TableRow } from '../../../ui/Table';
import { formatNumber, slugifyText } from '../../../utilities/HelperFunc';
import Pagination from '../../../features/products/allProducts/Pagination';
import Empty from '../../../ui/Empty';
import OrderActions from '../../../features/adminActions/OrderActions';
import { useEffect, useState } from 'react';
import { OrderType } from '../../../dtos/orderDto';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  extractFormData,
  extractParams,
  getData,
  queryClient,
  updateData,
} from '../../../api/requests';

const OrderLists = () => {
  const location = useLocation();
  const path = location.pathname;
  const label = path.split('/').slice(-1)[0].split('-').join(' ');

  const [allOrders, setAllOrders] = useState<OrderType[]>([]);
  const [searchField, setSearchField] = useState('reference');
  const [searchValue, setSearchValue] = useState('');
  const { page, sort, pageLabel } = useLoaderData() as {
    page: number;
    sort: string;
    pageLabel: string;
  };
  const [sortParams, setSortParams] = useSearchParams();
  const queryClientHook = useQueryClient();

  const { data } = useQuery({
    queryKey: [
      'fetchOrder',
      'orders',
      page ?? 1,
      sort ?? '-createdAt',
      pageLabel ?? 'pending',
    ],
    queryFn: () =>
      getData({
        url: `/orders?page=${page || 1}&sort=${
          sort || '-createdAt'
        }&orderStatus=${pageLabel || 'pending'}&isManual=false`,
      }),
  });

  const { orders }: { orders: OrderType[] } = data;
  const { totalPages, currentPage, nextPage, previousPage } = data.page;

  useEffect(() => {
    setAllOrders(orders);
  }, [orders]);

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let sortValue;
    if (e.target.value.toLowerCase().startsWith('old')) {
      sortValue = 'createdAt';
    }
    if (e.target.value.toLowerCase().startsWith('new')) {
      sortValue = '-createdAt';
    }
    if (e.target.value.toLowerCase().startsWith('highest')) {
      sortValue = '-totalAmount';
    }
    if (e.target.value.toLowerCase().startsWith('lowest')) {
      sortValue = 'totalAmount';
    }

    sortParams.set('sort', sortValue as string);
    setSortParams(sortParams);
  };

  const handleSearchField = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value.toLowerCase().startsWith('status')) {
      setSearchField('orderStatus');
    } else {
      setSearchField(e.target.value);
    }
  };

  // get users based on the searchfield set in setSearch and the keyword typed into the search value input field.
  const handleSearchValue = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    let timeOut: number | undefined;
    const filterData = async () => {
      const newUrl = `/orders?search=${searchField}&value=${searchValue}&orderStatus=${
        pageLabel || 'pending'
      }`;

      timeOut = setTimeout(async () => {
        const resp = queryClientHook.fetchQuery({
          queryKey: [
            'fetchOrder',
            'orders',
            searchValue,
            pageLabel ?? 'pending',
          ],
          queryFn: () => getData({ url: newUrl }),
        });

        const data = await resp;

        if (searchValue) {
          setAllOrders(data.orders);
        } else {
          setAllOrders(orders);
        }
      }, 1000);
    };

    filterData();
    return () => {
      clearTimeout(timeOut);
    };
  }, [queryClientHook, searchValue]);

  const headers = [
    'reference',
    'invoice no.',
    'customer',
    'subtotal',
    'discount',
    'total',
    'status',
    'action',
  ];
  const column = '1fr 1.1fr 1.5fr 1fr 1fr 1fr 1fr 1.3fr';
  return (
    <AdminSection>
      {/* Header */}
      <AdminHeader>
        <h4>{label}</h4>
      </AdminHeader>
      {/* Table search */}
      <AppTableSearch
        searchOptions={['reference', 'invoice no', 'customer name']}
        sortOptions={[
          'new to old',
          'old to new',
          'highest to lowest',
          'lowest to highest',
        ]}
        dark={true}
        bg='var(--admin-input-bg)'
        onSort={handleSort}
        onSearchField={handleSearchField}
        onSearchValue={handleSearchValue}
      />
      {/* Table */}
      <AdminBox>
        {allOrders.length > 0 ? (
          <>
            <Table headers={headers} column={column}>
              {allOrders.map((order) => {
                // Set  style depending on the status of the order.
                let status;
                if (order.orderStatus === 'pending') status = 'pending';
                if (order.orderStatus === 'confirmed') status = 'confirmed';
                if (order.orderStatus === 'delivered') status = 'delivered';

                return (
                  <TableRow $column={column} key={order._id}>
                    <p role='transaction reference'>{order.reference}</p>
                    <p role='invoice number'>{order.invoiceNo}</p>
                    <p role='user name'>{order.customerName}</p>
                    <p role='subtotal'>
                      &#8358;{formatNumber(order.subtotal)}{' '}
                    </p>
                    <p role='discount'>
                      &#8358;
                      {order.discount ? formatNumber(order.discount) : '0.00'}
                    </p>
                    <p role='grand total'>
                      &#8358;{formatNumber(order.totalAmount)}
                    </p>

                    <div className={`capitalize `}>
                      <span className={status}>{order.orderStatus}</span>
                    </div>

                    <OrderActions
                      viewURL={`/admin/${slugifyText(label)}/${order.orderNo}`}
                      showApproved={pageLabel === 'pending'}
                      showBoth={pageLabel === 'confirmed'}
                      id={order._id}
                      orderStatus={order.orderStatus}
                    />
                  </TableRow>
                );
              })}
            </Table>
            {totalPages > 1 && (
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                nextPage={nextPage}
                previousPage={previousPage}
                pageLink={`/admin/${label}`}
                marginTop='2rem'
              />
            )}
          </>
        ) : (
          <Empty
            message={`No ${label} awaiting your action.`}
            showLink={false}
            type='dark'
          />
        )}
      </AdminBox>
    </AdminSection>
  );
};

export default OrderLists;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const params = extractParams(request);
  const lastURLParams = request.url.split('/');
  const pageName = lastURLParams[lastURLParams.length - 1].split('?')[0];

  let pageLabel = '';
  if (pageName === 'pending-orders') pageLabel = 'pending';
  if (pageName === 'confirmed-orders') pageLabel = 'confirmed';
  if (pageName === 'delivered-orders') pageLabel = 'delivered';
  if (pageName === 'cancelled-orders') pageLabel = 'cancelled';

  const { page, sort } = params;
  await queryClient.ensureQueryData({
    queryKey: [
      'fetchOrder',
      'orders',
      page ?? 1,
      sort ?? '-createdAt',
      pageLabel ?? 'pending',
    ],
    queryFn: () =>
      getData({
        url: `/orders?page=${page || 1}&sort=${
          sort || '-createdAt'
        }&orderStatus=${pageLabel || 'pending'}&isManual=false`,
      }),
  });

  return { ...params, pageLabel };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { id, ...data } = await extractFormData(request);

  return updateData({
    url: `/orders/${id}`,
    data,
    invalidate: ['fetchOrder'],
  });
};
