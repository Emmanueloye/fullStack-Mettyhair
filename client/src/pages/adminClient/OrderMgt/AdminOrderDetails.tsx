/* eslint-disable react-refresh/only-export-components */
import {
  AdminHeader,
  AdminSection,
  AFormGroup,
  ThreeGrid,
  TwoGrid,
} from '../../../features/adminNavLayouts/AdminUtils';
import {
  Link,
  LoaderFunctionArgs,
  useLoaderData,
  useLocation,
} from 'react-router-dom';
import { TabContentWrapper } from '../../../features/Tab/TabContentWrapper';
import ProductTotal from '../../../features/shoppingCart/ProductTotal';
import { formatDate, slugifyText } from '../../../utilities/HelperFunc';
import { Header } from '../../../features/authComponent/AuthStyles';
import BillingDetails from '../../../features/checkout/BillingDetails';
import { getData, queryClient } from '../../../api/requests';
import { useQuery } from '@tanstack/react-query';
import OrderSum from '../../../features/checkout/OrderSum';
import { OrderItemType } from '../../../dtos/orderDto';
import Input, { Label } from '../../../ui/Input';
// import OrderActionBtn from '../../../features/checkout/OrderActionBtn';

const AdminOrderDetails = () => {
  const location = useLocation();
  const path = location.pathname;
  const label = path.split('/').slice(-2)[0].split('-').join(' ');
  const params = useLoaderData() as { orderNo: string };

  const { data } = useQuery({
    queryKey: ['fetchOrder', 'order', params.orderNo],
    queryFn: () => getData({ url: `/orders/${params.orderNo}` }),
  });

  const { order, orderItems } = data;

  return (
    <AdminSection>
      <AdminHeader>
        <h4>Order details</h4>
        <Link to={`/admin/${slugifyText(label)}`}>{label}</Link>
      </AdminHeader>
      <TabContentWrapper $dark={true}>
        {/* order Info details */}
        <ThreeGrid>
          {/* invoice number */}
          <AFormGroup>
            <Input
              id='invoiceNo'
              type='text'
              defaultValue={`Invoice No: ${order.invoiceNo}`}
              $dark
              disabled
            />
          </AFormGroup>
          {/* order number */}
          <AFormGroup>
            <Input
              id='orderNo'
              type='text'
              defaultValue={`Order No: ${order.orderNo}`}
              $dark
              disabled
            />
          </AFormGroup>
          {/* payment reference number */}
          <AFormGroup>
            <Input
              id='paymentRef'
              type='text'
              defaultValue={`Payment Ref: ${order.reference}`}
              $dark
              disabled
            />
          </AFormGroup>
        </ThreeGrid>
        {/* Biling and order details */}
        <div className='grid'>
          {/* Billing address area */}
          <BillingDetails order={order} disabled={true} isDark={true} />
        </div>
        {/* Order details area */}
        <div className='box'>
          <Header
            $mb='1rem'
            $bg='var(--admin-input-bg)'
            $color='var(--admin-sec-text-color)'
          >
            <h4>Customer order</h4>
          </Header>
          {orderItems.map((item: OrderItemType) => (
            <OrderSum key={item._id} orderItem={item} isDark={true} />
          ))}

          <ProductTotal
            showHeader={false}
            marginTop='0'
            btnType='btn'
            isOrder={true}
            isDark={true}
            productTotal={{
              subtotal: order.subtotal,
              totalDiscount: order.discount,
            }}
          />

          {/* Audit trail */}
          <TwoGrid>
            <AFormGroup>
              <Label htmlFor='confirmedBy'>confirmed by</Label>
              <Input
                id='confirmedBy'
                type='text'
                defaultValue={order?.confirmedBy?.fullName}
                $dark
                disabled
                $capitalize={true}
              />
            </AFormGroup>
            <AFormGroup>
              <Label htmlFor='confirmedDate'>confirmed Date</Label>
              <Input
                id='confirmedDate'
                type='text'
                defaultValue={
                  order.confirmationDate &&
                  formatDate(new Date(order.confirmationDate))
                }
                $dark
                disabled
                $capitalize={true}
              />
            </AFormGroup>
            <AFormGroup>
              <Label htmlFor='deliveredBy'>Delivered by</Label>
              <Input
                id='deliveredBy'
                type='text'
                defaultValue={order?.deliveredBy?.fullName}
                $dark
                disabled
                $capitalize={true}
              />
            </AFormGroup>
            <AFormGroup>
              <Label htmlFor='deliveredDate'>Delivered Date</Label>
              <Input
                id='deliveredDate'
                type='text'
                defaultValue={
                  order.deliveredDate &&
                  formatDate(new Date(order.deliveredDate))
                }
                $dark
                disabled
                $capitalize={true}
              />
            </AFormGroup>
          </TwoGrid>
        </div>
      </TabContentWrapper>
    </AdminSection>
  );
};

export default AdminOrderDetails;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  await queryClient.ensureQueryData({
    queryKey: ['fetchOrder', 'order', params.orderNo],
    queryFn: () => getData({ url: `/orders/${params.orderNo}` }),
  });

  return params;
};
