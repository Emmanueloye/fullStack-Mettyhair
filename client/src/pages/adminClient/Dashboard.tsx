/* eslint-disable react-refresh/only-export-components */
import { IoWarningSharp } from 'react-icons/io5';
import DashboardCard from '../../features/adminDashboard/DashboardCard';
import {
  AdminBox,
  AdminGrid,
  AdminSection,
  TwoGrid,
} from '../../features/adminNavLayouts/AdminUtils';
import { FcSalesPerformance } from 'react-icons/fc';
import Container from '../../ui/Container';
import { IoMdCart } from 'react-icons/io';
import { FaUserAlt } from 'react-icons/fa';
import Barchart from '../../features/adminDashboard/Barchart';
import { Table, TableRow } from '../../ui/Table';
import { formatNumber } from '../../utilities/HelperFunc';
import { getData, queryClient } from '../../api/requests';
import { useQuery } from '@tanstack/react-query';
import { useOutletContext } from 'react-router-dom';
import { User } from '../../dtos/userDto';
import Empty from '../../ui/Empty';

const Dashboard = () => {
  const user = useOutletContext() as User;

  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: () => getData({ url: '/stats/dashboard-metrics' }),
  });

  const tableHeader1 = ['S/N', 'product name', 'quantity sold'];

  const column = '.5fr 1.6fr 1fr ';
  return (
    <AdminSection>
      <Container>
        <AdminBox>
          <h4>dashboard</h4>
        </AdminBox>
        {/* Dashboard cards */}
        <AdminGrid>
          <DashboardCard
            title='Confirm/Delivered orders'
            icon={<FcSalesPerformance />}
            url='/admin'
            linkLabel={
              user.role.startsWith('super')
                ? `₦${
                    stats.currentMonthSales
                      ? formatNumber(stats.currentMonthSales)
                      : '0.00'
                  }`
                : 'No access'
            }
          />
          <DashboardCard
            title='stockout warning'
            icon={<IoWarningSharp />}
            url='/admin/stockout-notice'
            linkLabel={`${stats?.stockOut} ${
              stats?.stockOut > 1 ? 'Items' : 'item'
            }`}
            iconColor='red'
          />
          <DashboardCard
            title='new/pending orders'
            icon={<IoMdCart />}
            url='/admin/pending-orders'
            linkLabel={`${stats.pendingOrder} ${
              stats.pendingOrder > 1 ? 'Items' : 'item'
            }`}
            iconColor='green'
          />
          <DashboardCard
            title='new customers'
            icon={<FaUserAlt />}
            url='/admin/new-users-report'
            linkLabel={`${stats.newCustomers} ${
              stats.newCustomers > 1 ? 'users' : 'user'
            }`}
            iconColor='purple'
          />
        </AdminGrid>
        {/* monthly sales bar chart */}
        {user.role.startsWith('super') ? (
          <Barchart data={stats.chartData} />
        ) : (
          <>
            <AdminBox>
              <h4>monthly sales (NGN'000)</h4>
            </AdminBox>
            <Empty type='dark' message='No access' showLink={false} />
          </>
        )}
        {/* Grid table one */}
        <TwoGrid>
          <AdminBox>
            <h4>Top 5 Selling products</h4>
            <Table headers={tableHeader1} column={column} width='0'>
              {stats.topFiveProducts.map(
                (
                  product: { productName: string; quantitySold: number },
                  key: number
                ) => {
                  return (
                    <TableRow $column={column} $width='0' key={key}>
                      <p>{key + 1}</p>
                      <p>{product.productName}</p>
                      <p className='text-center'>
                        {formatNumber(product.quantitySold)}
                      </p>
                    </TableRow>
                  );
                }
              )}
            </Table>
          </AdminBox>
          <AdminBox>
            <h4>Top 5 customers</h4>
            {user.role.startsWith('super') ? (
              <Table headers={tableHeader1} column={column} width='0'>
                {stats.topFiveCustomers.map(
                  (
                    customer: { customerName: string; totalSales: number },
                    index: number
                  ) => (
                    <TableRow $column={column} $width='0' key={index}>
                      <p>{index + 1}</p>
                      <p>{customer.customerName}</p>
                      <p className='text-center'>
                        &#8358;{formatNumber(customer.totalSales)}
                      </p>
                    </TableRow>
                  )
                )}
              </Table>
            ) : (
              <Empty type='dark' message='No access' showLink={false} />
            )}
          </AdminBox>
        </TwoGrid>
      </Container>
    </AdminSection>
  );
};

export default Dashboard;

export const loader = () => {
  return queryClient.ensureQueryData({
    queryKey: ['stats'],
    queryFn: () => getData({ url: '/stats/dashboard-metrics' }),
  });
};
