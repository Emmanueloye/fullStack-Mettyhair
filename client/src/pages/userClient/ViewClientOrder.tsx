/* eslint-disable react-refresh/only-export-components */
import { Link, LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
import { getData, queryClient } from '../../api/requests';
import { useQuery } from '@tanstack/react-query';

import {
  AdminHeader,
  AdminSection,
  AFormGroup,
  ThreeGrid,
} from '../../features/adminNavLayouts/AdminUtils';
import {
  OrderGrid,
  OrderLabel,
} from '../../features/adminAccount/adminOrderStyles';
import Input, { Label } from '../../ui/Input';
import ProductTotal from '../../features/shoppingCart/ProductTotal';
import { OrderItemType } from '../../dtos/orderDto';

const ViewClientOrder = () => {
  const params = useLoaderData() as { id: string };

  const {
    data: { salesOrder },
  } = useQuery({
    queryKey: ['fetchOrder', 'singleWholeSellerOrder', params.id],
    queryFn: () => getData({ url: `/sales-orders/${params.id}` }),
  });

  return (
    <AdminSection>
      {/* Header */}
      <AdminHeader>
        <h4>
          View order: {salesOrder.invoiceNo ? 'INV' : 'SO'}-
          {salesOrder.invoiceNo ? salesOrder.invoiceNo : salesOrder.orderNo}
        </h4>
        <Link to='/my-dashboard/new-order'>new sales Order</Link>
      </AdminHeader>

      <>
        {/* header */}

        <OrderLabel>customer details</OrderLabel>
        <ThreeGrid>
          <AFormGroup>
            <Label htmlFor='customer'>customer</Label>
            <Input
              type='customer'
              id='customer'
              name='customer'
              defaultValue={salesOrder.user.fullName}
              $capitalize
              disabled
            />
          </AFormGroup>
          <AFormGroup>
            <Label htmlFor='email'>Email</Label>
            <Input
              type='email'
              id='email'
              name='email'
              defaultValue={salesOrder.user.email}
              disabled
            />
          </AFormGroup>
          <AFormGroup>
            <Label htmlFor='phone' type='dark'>
              Telephone
            </Label>
            <Input
              type='text'
              id='phone'
              name='phone'
              defaultValue={salesOrder.phone}
              disabled
            />
          </AFormGroup>
          <AFormGroup>
            <Label htmlFor='address'>address</Label>
            <Input
              type='text'
              id='address'
              name='address'
              defaultValue={salesOrder.address}
              $capitalize
              disabled
            />
          </AFormGroup>
        </ThreeGrid>

        {/* Customer order section */}
        <OrderLabel className='mb-2'>customer order</OrderLabel>

        <div style={{ overflowX: 'auto', margin: '2rem 0 2rem 0' }}>
          {/* Header */}
          <OrderGrid $isAction>
            <OrderLabel>product</OrderLabel>
            <OrderLabel>color</OrderLabel>
            <OrderLabel>size</OrderLabel>
            <OrderLabel>quantity</OrderLabel>
            <OrderLabel>price</OrderLabel>
            <OrderLabel>subtotal</OrderLabel>
          </OrderGrid>
          {/* Dynamic inputs */}
          {salesOrder.orderItems?.map((val: OrderItemType, index: number) => {
            return (
              <OrderGrid key={index} $isAction>
                <AFormGroup className='mb-0'>
                  <Input
                    type='text'
                    id={`product-${index + 1}`}
                    name='product'
                    defaultValue={val.productId.productName}
                    $capitalize
                    disabled
                  />
                </AFormGroup>
                {/* color */}
                <AFormGroup className='mb-0'>
                  <Input
                    type='text'
                    id={`color-${index + 1}`}
                    name='color'
                    defaultValue={val.color}
                    $capitalize
                    disabled
                  />
                </AFormGroup>

                {/* sizes */}
                <AFormGroup className='mb-0'>
                  <Input
                    type='text'
                    id={`size-${index + 1}`}
                    name='size'
                    defaultValue={val.size}
                    $capitalize
                    disabled
                  />
                </AFormGroup>

                <AFormGroup className='mb-0'>
                  <Input
                    type='number'
                    id={`quantity-${index + 1}`}
                    name='quantity'
                    min={1}
                    defaultValue={val.quantity}
                    disabled
                  />
                </AFormGroup>
                <AFormGroup className='mb-0'>
                  <Input
                    type='text'
                    id={`price-${index + 1}`}
                    name='price'
                    defaultValue={val.price}
                    disabled
                  />
                </AFormGroup>
                <AFormGroup className='mb-0'>
                  <Input
                    type='text'
                    id={`subtotal-${index + 1}`}
                    name='subtotal'
                    defaultValue={val.quantity * val.sellingPrice}
                    disabled
                  />
                </AFormGroup>
              </OrderGrid>
            );
          })}
        </div>

        <ProductTotal
          showHeader={false}
          marginTop='0'
          btnType='btn'
          isOrder={true}
          isDark={true}
          hideBtn={true}
          productTotal={{
            subtotal: salesOrder.subtotal,
            totalDiscount: salesOrder.subtotal - salesOrder.totalAmount,
          }}
        />
      </>
    </AdminSection>
  );
};

export default ViewClientOrder;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  await queryClient.ensureQueryData({
    queryKey: ['fetchOrder', 'singleWholeSellerOrder', params.id],
    queryFn: () => getData({ url: `/sales-orders/${params.id}` }),
  });

  return params;
};
