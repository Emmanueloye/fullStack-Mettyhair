/* eslint-disable react-refresh/only-export-components */
import {
  ActionFunctionArgs,
  Link,
  LoaderFunctionArgs,
  useActionData,
  useLoaderData,
  useSubmit,
} from 'react-router-dom';
import {
  AdminHeader,
  AdminSection,
  AFormGroup,
  ThreeGrid,
} from '../../../features/adminNavLayouts/AdminUtils';
import {
  OrderGrid,
  OrderLabel,
} from '../../../features/adminAccount/adminOrderStyles';
import Input, { Label } from '../../../ui/Input';
import ProductTotal from '../../../features/shoppingCart/ProductTotal';
import {
  extractFormData,
  getData,
  queryClient,
  updateData,
} from '../../../api/requests';
import { useQuery } from '@tanstack/react-query';
import { OrderItemType } from '../../../dtos/orderDto';
import { FaPlus } from 'react-icons/fa';
import Button from '../../../ui/Button';
import { formatNumber } from '../../../utilities/HelperFunc';
import FormError from '../../../ui/FormError';
import { InfoType } from '../../../dtos/utilsDto';

const InvoiceSalesOrder = () => {
  const params = useLoaderData() as { id: string };
  const error = useActionData() as InfoType;
  const submit = useSubmit();

  const {
    data: { salesOrder },
  } = useQuery({
    queryKey: ['fetchOrder', 'order', params.id],
    queryFn: () => getData({ url: `/sales-orders/${params.id}` }),
  });

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('orderNo', salesOrder.orderNo);
    formData.append('user', salesOrder.user._id);
    submit(formData, { method: 'PATCH' });
  };

  return (
    <AdminSection>
      {/* Header */}
      <AdminHeader>
        <h4>Invoice order: SO-{salesOrder.orderNo.toUpperCase()}</h4>
        <Link to='/admin/account/sales-orders'>Sales Orders</Link>
      </AdminHeader>

      <>
        {/* header */}

        {error && <FormError info={error.message} />}

        <OrderLabel>customer details</OrderLabel>
        <ThreeGrid>
          <AFormGroup>
            <Label htmlFor='customer' type='dark'>
              customer
            </Label>
            <Input
              type='text'
              id='customer'
              name='customer'
              defaultValue={salesOrder.customerName}
              $dark
              $capitalize
              disabled
            />
          </AFormGroup>
          <AFormGroup>
            <Label htmlFor='email' type='dark'>
              Email
            </Label>
            <Input
              type='email'
              id='email'
              $dark
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
              $dark
              name='phone'
              defaultValue={salesOrder.phone}
              disabled
            />
          </AFormGroup>
          <AFormGroup>
            <Label htmlFor='address' type='dark'>
              address
            </Label>
            <Input
              type='text'
              id='address'
              $dark
              name='address'
              defaultValue={salesOrder.address}
              disabled
            />
          </AFormGroup>
          <AFormGroup>
            <Label htmlFor='invoiceAmt' type='dark'>
              Invoice Amount
            </Label>
            <Input
              type='text'
              id='invoiceAmt'
              $dark
              name='invoiceAmt'
              defaultValue={formatNumber(salesOrder.totalAmount)}
              disabled
            />
          </AFormGroup>
        </ThreeGrid>

        {/* Customer order section */}
        <OrderLabel className='mb-2'>customer order</OrderLabel>

        <div style={{ overflowX: 'auto', margin: '2rem 0 2rem 0' }}>
          {/* Header */}
          <OrderGrid type='dark' $isAction>
            <OrderLabel>product</OrderLabel>
            <OrderLabel>color</OrderLabel>
            <OrderLabel>size</OrderLabel>
            <OrderLabel>quantity</OrderLabel>
            <OrderLabel>price</OrderLabel>
            <OrderLabel>subtotal</OrderLabel>
          </OrderGrid>
          {/* Dynamic inputs */}
          {salesOrder.orderItems.map((order: OrderItemType, index: number) => {
            return (
              <OrderGrid $isAction key={order._id}>
                <AFormGroup className='mb-0'>
                  <Input
                    type='text'
                    name='product'
                    $dark
                    $capitalize
                    defaultValue={order.productId.productName}
                    disabled
                  />
                </AFormGroup>
                {/* color */}
                <AFormGroup className='mb-0'>
                  <Input
                    type='text'
                    name='color'
                    $dark
                    $capitalize
                    defaultValue={order.color}
                    disabled
                  />
                </AFormGroup>
                {/* Sizes */}
                <AFormGroup className='mb-0'>
                  <Input
                    type='text'
                    name='size'
                    $dark
                    $capitalize
                    defaultValue={order.size}
                    disabled
                  />
                </AFormGroup>

                <AFormGroup className='mb-0'>
                  <Input
                    type='text'
                    id={`quantity-${index}`}
                    $dark
                    name='quantity'
                    defaultValue={order.quantity}
                    disabled
                  />
                </AFormGroup>
                <AFormGroup className='mb-0'>
                  <Input
                    type='text'
                    id={`price-${index}`}
                    $dark
                    name='price'
                    defaultValue={order.sellingPrice}
                    disabled
                  />
                </AFormGroup>
                <AFormGroup className='mb-0'>
                  <Input
                    type='text'
                    id={`subtotal-${index}`}
                    $dark
                    name='subtotal'
                    defaultValue={order.quantity * order.sellingPrice}
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
            totalDiscount: salesOrder.discount ?? 0,
          }}
        />
        {!salesOrder.invoiceNo && (
          <Button
            type='submit'
            btnText='invoice order'
            icon={<FaPlus />}
            onBtnTrigger={handleSubmit}
          />
        )}
      </>
    </AdminSection>
  );
};

export default InvoiceSalesOrder;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  await queryClient.ensureQueryData({
    queryKey: ['fetchOrder', 'order', params.id],
    queryFn: () => getData({ url: `/sales-orders/${params.id}` }),
  });

  return params;
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const data = await extractFormData(request);
  return updateData({
    url: `/sales-orders/invoice/${params.id}`,
    data,
    setToast: true,
    invalidate: ['fetchOrder'],
    redirectTo: '/admin/account/sales-orders',
  });
};
