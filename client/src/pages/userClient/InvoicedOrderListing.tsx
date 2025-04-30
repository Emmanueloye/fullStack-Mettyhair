/* eslint-disable react-refresh/only-export-components */
import {
  Link,
  LoaderFunctionArgs,
  useLoaderData,
  useSearchParams,
} from 'react-router-dom';

import { useEffect, useState } from 'react';
import { OrderType } from '../../dtos/orderDto';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { extractParams, getData, queryClient } from '../../api/requests';
import {
  AdminBox,
  AdminHeader,
  AdminSection,
} from '../../features/adminNavLayouts/AdminUtils';
import AppTableSearch from '../../ui/AppTableSearch';
import { Table, TableRow } from '../../ui/Table';
import { formatNumber } from '../../utilities/HelperFunc';
import Pagination from '../../features/products/allProducts/Pagination';
import Empty from '../../ui/Empty';
import SalesOrderAction from '../../features/adminAccount/SalesOrderAction';

const InvoicedOrderListing = () => {
  const { page, sort } = useLoaderData() as { page: number; sort: string };
  const [allSalesOrders, setAllSalesOrders] = useState<OrderType[]>([]);
  const [searchField, setSearchField] = useState('orderNo');
  const [searchValue, setSearchValue] = useState('');
  const [sortParams, setSortParams] = useSearchParams();
  const queryClientHook = useQueryClient();

  const { data } = useQuery({
    queryKey: ['fetchOrder', 'invoicedOrders', page ?? 1, sort ?? '-createdAt'],
    queryFn: () =>
      getData({
        url: `/sales-orders/wholeseller?page=${page || 1}&sort=${
          sort || '-createdAt'
        }&orderStatus=invoiced`,
      }),
  });

  const { salesOrders }: { salesOrders: OrderType[] } = data || {};

  const { totalPages, currentPage, nextPage, previousPage } = data.page;

  useEffect(() => {
    setAllSalesOrders(salesOrders);
  }, [salesOrders]);

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let sortValue;

    if (e.target.value.toLowerCase().startsWith('old')) {
      sortValue = 'createdAt';
    }
    if (e.target.value.toLowerCase().startsWith('new')) {
      sortValue = '-createdAt';
    }
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
      const newUrl = `/sales-orders/wholeseller?search=${encodeURIComponent(
        searchField
      )}&value=${encodeURIComponent(searchValue)}&orderStatus=invoiced`;

      timeOut = setTimeout(async () => {
        const resp = queryClientHook.fetchQuery({
          queryKey: ['fetchOrder', 'invoicedOrders', searchValue],
          queryFn: () => getData({ url: newUrl }),
        });

        const data = await resp;

        if (searchValue) {
          setAllSalesOrders(data.salesOrders);
        } else {
          setAllSalesOrders(salesOrders);
        }
      }, 1000);
    };

    filterData();
    return () => {
      clearTimeout(timeOut);
    };
  }, [salesOrders, searchValue]);

  // Table config
  const headers = [
    'orderNo',
    'customer',
    'subtotal',
    'discount',
    'amount',
    'payment',
    'pay status',
    'status',
    'action',
  ];
  const column = '0.6fr 1.7fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr';

  return (
    
    <AdminSection type='light'>
      {/* Header */}
      <AdminHeader>
        <h4>Manage sales orders</h4>
        <Link to='/my-dashboard/new-order'>New sales Order</Link>
      </AdminHeader>
      {/* Table search */}
      <AppTableSearch
        searchOptions={['order No']}
        sortOptions={['old to new', 'new to old']}
        dark={true}
        bg='var(--admin-input-bg)'
        onSort={handleSort}
        onSearchField={handleSearchField}
        onSearchValue={handleSearchValue}
      />
      {/* Table */}
      <AdminBox>
        {allSalesOrders?.length > 0 ? (
          <>
            <Table headers={headers} column={column}>
              {allSalesOrders.map((order) => {
                const totalPayment = order.amountPaid.reduce(
                  (acc, curr) => acc + curr,
                  0
                );

                return (
                  <TableRow $column={column} key={order._id}>
                    <p>{order.orderNo}</p>
                    <p>{order.customerName}</p>
                    <p>{formatNumber(order.subtotal)}</p>
                    <p>
                      {order.discount ? formatNumber(order.discount) : '0.00'}
                    </p>
                    <p>{formatNumber(order.totalAmount)}</p>
                    <p>{formatNumber(totalPayment) || '0.00'}</p>
                    <p>{order.paymentStatus}</p>
                    <p>
                      {order.orderStatus === 'pending'
                        ? 'open'
                        : order.orderStatus}
                    </p>
                    {order.isManual && (
                      <SalesOrderAction
                        editURL={`/my-dashboard/edit/${order._id}`}
                        viewURL={`/my-dashboard/view/${order._id}`}
                        hideEdit={order.orderStatus === 'pending'}
                      />
                    )}
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
                pageLink='/admin/account/sales-orders'
                marginTop='2rem'
              />
            )}
          </>
        ) : (
          <Empty
            message={'No sales orders available'}
            showLink={false}
            type='dark'
          />
        )}
      </AdminBox>
    </AdminSection>
  );
};

export default InvoicedOrderListing;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const params = extractParams(request);
  const { page, sort } = params;
  await queryClient.ensureQueryData({
    queryKey: ['fetchOrder', 'invoicedOrders', page ?? 1, sort ?? '-createdAt'],
    queryFn: () =>
      getData({
        url: `/sales-orders/wholeseller?page=${page || 1}&sort=${
          sort || '-createdAt'
        }&orderStatus=invoiced`,
      }),
  });
  return params;
};
