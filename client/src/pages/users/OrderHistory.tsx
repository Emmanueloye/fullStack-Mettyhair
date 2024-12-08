/* eslint-disable react-refresh/only-export-components */
import { FiBox } from 'react-icons/fi';
import Pagination from '../../features/products/allProducts/Pagination';
import OrderTableAction from '../../features/Profile/OrderTableAction';
import { TabContentWrapper } from '../../features/Tab/TabContentWrapper';
import Empty from '../../ui/Empty';
import { Table, TableRow } from '../../ui/Table';
import { formatNumber } from '../../utilities/HelperFunc';
import { ProfileHeader } from './EditProfile';
import AppTableSearch from '../../ui/AppTableSearch';
import {
  LoaderFunctionArgs,
  useLoaderData,
  useSearchParams,
} from 'react-router-dom';
import { extractParams, getData, queryClient } from '../../api/requests';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { OrderType } from '../../dtos/orderDto';
import { useEffect, useState } from 'react';

const OrderHistory = () => {
  const [allOrders, setAllOrders] = useState<OrderType[]>([]);
  const [searchField, setSearchField] = useState('orderNo');
  const [searchValue, setSearchValue] = useState('');
  const { page, sort } = useLoaderData() as { page: number; sort: string };
  const [sortParams, setSortParams] = useSearchParams();
  const queryClientHook = useQueryClient();

  const { data } = useQuery({
    queryKey: ['fetchOrder', 'myorders', page ?? 1, sort ?? '-createdAt'],
    queryFn: () =>
      getData({
        url: `/orders/me?page=${page || 1}&sort=${sort || '-createdAt'}`,
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
      const newUrl = `/orders/me?search=${searchField}&value=${searchValue}`;

      timeOut = setTimeout(async () => {
        const resp = queryClientHook.fetchQuery({
          queryKey: ['fetchOrder', 'myorders', searchValue],
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
  }, [orders, queryClientHook, searchValue]);

  // Can have these variables in another file and export here
  const headers = ['order no', 'invoice no', 'amount', 'status', 'action'];
  const column = '1fr 1fr 1fr 1fr 1.5fr';

  return (
    <TabContentWrapper>
      <ProfileHeader>Order history</ProfileHeader>
      <AppTableSearch
        searchOptions={['order no', 'invoice no', 'status']}
        sortOptions={[
          'new to old',
          'old to new',
          'highest to lowest',
          'lowest to highest',
        ]}
        onSort={handleSort}
        onSearchField={handleSearchField}
        onSearchValue={handleSearchValue}
      />
      {allOrders.length > 0 ? (
        <>
          <Table headers={headers} column={column}>
            {allOrders.map((order) => {
              let status;
              if (order.orderStatus === 'pending') status = 'pending';
              if (order.orderStatus === 'confirmed') status = 'confirmed';
              if (order.orderStatus === 'delivered') status = 'delivered';

              return (
                <TableRow $column={column} key={order.invoiceNo}>
                  <p>{order.orderNo}</p>
                  <p>{order.invoiceNo}</p>
                  <p>&#8358;{formatNumber(order.totalAmount)}</p>
                  <div className={`capitalize `}>
                    <span className={status}>{order.orderStatus}</span>
                  </div>
                  <OrderTableAction
                    view={`/user/order-history/view/${order.orderNo}`}
                    download={`/user/order-history/${order.orderNo}`}
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
              pageLink='/admin/products'
              marginTop='2rem'
            />
          )}
        </>
      ) : (
        <Empty
          icon={<FiBox />}
          message='We cannot wait for you to patronise us. Your order history will be populated once you make your first purchase.'
          btnText='continue shopping'
          url='/'
          iconSize='8rem'
        />
      )}
    </TabContentWrapper>
  );
};

export default OrderHistory;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const params = extractParams(request);
  const { page, sort } = params;
  await queryClient.ensureQueryData({
    queryKey: ['fetchOrder', 'myorders', page ?? 1, sort ?? '-createdAt'],
    queryFn: () =>
      getData({
        url: `/orders/me?page=${page || 1}&sort=${sort || '-createdAt'}`,
      }),
  });

  return params;
};
