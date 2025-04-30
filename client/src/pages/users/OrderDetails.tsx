/* eslint-disable react-refresh/only-export-components */
import {
  Center,
  TabContentWrapper,
} from '../../features/Tab/TabContentWrapper';
import Container from '../../ui/Container';
import { Header } from '../../features/authComponent/AuthStyles';
import ProductTotal from '../../features/shoppingCart/ProductTotal';
import BillingDetails from '../../features/checkout/BillingDetails';
import { ProfileHeader } from './EditProfile';
import { getData, queryClient } from '../../api/requests';
import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import OrderSum from '../../features/checkout/OrderSum';
import { OrderItemType } from '../../dtos/orderDto';
import { Helmet } from 'react-helmet-async';

const OrderDetails = () => {
  const params = useLoaderData() as { orderNo: string };

  const { data } = useQuery({
    queryKey: ['fetchOrder', 'order', params.orderNo],
    queryFn: () => getData({ url: `/orders/${params.orderNo}` }),
  });

  const { order, orderItems } = data;

  return (
    <>
      <Helmet>
        <title>MettyHair - Order Details</title>
      </Helmet>
      <TabContentWrapper>
        <ProfileHeader>Order Details</ProfileHeader>

        <Container>
          <Center className='invoice'>
            <p>Invoice No: {order.invoiceNo}</p>
          </Center>

          <div className='grid'>
            {/* Billing address will get more data via props in future */}
            <BillingDetails order={order} disabled={true} />

            {/* Order header */}
            <div className='box'>
              <Header
                $mb='1rem'
                $bg='var(--main-red-500)'
                $color='var(--main-red-50)'
              >
                <h4>your order</h4>
              </Header>

              {/* Order summary will be mapped through */}
              {orderItems.map((item: OrderItemType) => (
                <OrderSum key={item._id} orderItem={item} />
              ))}
              {/* Update the data from the parent */}
              <ProductTotal
                showHeader={false}
                marginTop='0'
                btnType='btn'
                isOrder={true}
                productTotal={{
                  subtotal: order.subtotal,
                  totalDiscount: order.discount,
                }}
              />
            </div>
          </div>
        </Container>
      </TabContentWrapper>
    </>
  );
};

export default OrderDetails;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  await queryClient.ensureQueryData({
    queryKey: ['fetchOrder', 'order', params.orderNo],
    queryFn: () => getData({ url: `/orders/${params.orderNo}` }),
  });

  return params;
};
