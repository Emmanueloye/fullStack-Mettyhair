import { Link } from 'react-router-dom';
import {
  AdminBox,
  AdminHeader,
  AdminSection,
} from '../../../features/adminNavLayouts/AdminUtils';
import AppTableSearch from '../../../ui/AppTableSearch';
import { Table, TableRow } from '../../../ui/Table';
import Empty from '../../../ui/Empty';
import Pagination from '../../../features/products/allProducts/Pagination';
import { getData, queryClient } from '../../../api/requests';
import { useQuery } from '@tanstack/react-query';
import { OrderType } from '../../../dtos/orderDto';
import { formatNumber } from '../../../utilities/HelperFunc';

const SalesOrderList = () => {
  const { data } = useQuery({
    queryKey: ['fetchOrder', 'salesOrders'],
    queryFn: () => getData({ url: '/sales-orders?isManual=true' }),
  });

  const { salesOrders }: { salesOrders: OrderType[] } = data || {};
  console.log(salesOrders);

  // Table config
  const headers = [
    'orderNo',
    'customer',
    'subtotal',
    'discount',
    'amount',
    'status',
    'action',
  ];
  const column = '0.6fr 1.7fr 1fr 1fr 1fr 1fr 1fr';

  return (
    <AdminSection>
      {/* Header */}
      <AdminHeader>
        <h4>Manage sales orders</h4>
        <Link to='/admin/account/create-order'>New sales Order</Link>
      </AdminHeader>
      {/* Table search */}
      <AppTableSearch
        searchOptions={['orderNo']}
        sortOptions={['old to new', 'new to old']}
        dark={true}
        bg='var(--admin-input-bg)'
        onSort={() => {}}
        onSearchField={() => {}}
        onSearchValue={() => {}}
      />
      {/* Table */}
      <AdminBox>
        {salesOrders?.length > 0 ? (
          <>
            <Table headers={headers} column={column}>
              {salesOrders.map((order) => (
                <TableRow $column={column} key={order._id}>
                  <p>{order.orderNo}</p>
                  <p>{order.customerName}</p>
                  <p>{formatNumber(order.subtotal)}</p>
                  <p>
                    {order.discount ? formatNumber(order.discount) : '0.00'}
                  </p>
                  <p>{formatNumber(order.totalAmount)}</p>
                  <p>{order.salesOrderStatus}</p>
                  <p>action</p>
                </TableRow>
              ))}
            </Table>

            <Pagination
              totalPages={1}
              currentPage={1}
              nextPage={1}
              previousPage={1}
              pageLink='/admin/products'
              marginTop='2rem'
            />
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
  );
};

export default SalesOrderList;

export const loader = () => {
  return queryClient.ensureQueryData({
    queryKey: ['fetchOrder', 'salesOrders'],
    queryFn: () => getData({ url: '/sales-orders?isManual=true' }),
  });
};
