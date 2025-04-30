/* eslint-disable react-refresh/only-export-components */
import { useCallback, useEffect, useState } from 'react';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  useLoaderData,
  useOutletContext,
  useSubmit,
} from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import {
  extractFormData,
  getData,
  getOnlyData,
  queryClient,
  updateData,
} from '../../api/requests';
import { OrderItemType } from '../../dtos/orderDto';
import { ProductTypes } from '../../dtos/productsDto';
import {
  AdminHeader,
  AdminSection,
  AFormGroup,
  ThreeGrid,
} from '../../features/adminNavLayouts/AdminUtils';
import FormError from '../../ui/FormError';
import {
  OrderGrid,
  OrderLabel,
} from '../../features/adminAccount/adminOrderStyles';
import Input, { Label } from '../../ui/Input';
import { Select } from '../../ui/SelectInput';
import { User } from '../../dtos/userDto';
import ProductTotal from '../../features/shoppingCart/ProductTotal';
import Button from '../../ui/Button';
import { Helmet } from 'react-helmet-async';

type changedValType = {
  product: string;
  productName: string;
  color: string;
  size: string;
  quantity: string;
  price: string;
  subtotal: string;
  discountPrice?: string;
  sellingPrice: string;
  orderItemId: string;
};

const EditClientOrder = () => {
  const user = useOutletContext<User>();
  const params = useLoaderData() as { id: string };
  const submit = useSubmit();

  const { data: singleOrder } = useQuery({
    queryKey: ['fetchOrder', 'clientOrder', params.id],
    queryFn: () =>
      getData({
        url: `/sales-orders/${params.id}`,
      }),
  });

  const { salesOrder } = singleOrder || {};
  // console.log(salesOrder);

  const orderData = salesOrder?.orderItems?.map((item: OrderItemType) => {
    return {
      product: item.productId._id,
      productName: item.productId.productName,
      color: item.color,
      size: item.size,
      quantity: item.quantity,
      subtotal: +item.sellingPrice * +item.quantity,
      discountPrice: item.discountPrice
        ? `${item.sellingPrice - item.discountPrice}`
        : '',
      sellingPrice: item.sellingPrice,
      orderItemId: item._id,
    };
  });

  const defaultColors = salesOrder?.orderItems?.map((item: OrderItemType) => {
    return item.productId.color;
  });
  const defaultSizes = salesOrder?.orderItems?.map((item: OrderItemType) => {
    return item.productId.size;
  });

  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [data, setData] = useState<changedValType[]>(orderData);
  //   const [customer] = useState(salesOrder.customerName);
  //   const [customerId] = useState(salesOrder.user._id);
  const [colors, setColors] = useState<string[]>(defaultColors);
  const [sizes, setSizes] = useState<string[]>(defaultSizes);
  //   const [email, setEmail] = useState(salesOrder.user.email);
  const [phone, setPhone] = useState(salesOrder.phone);
  const [address, setAddress] = useState(salesOrder.address);
  const [isProductChange, setIsProductChange] = useState(false);

  const {
    data: { products },
  } = useQuery({
    queryKey: ['fetchProduct', 'products'],
    queryFn: () =>
      getOnlyData({ url: '/products?isActive=true&quantity[gt]=0' }),
  });

  const calculateSubTotals = () => {
    // Update the state with the new data including subtotals
    setData(
      data?.map((item) => ({
        ...item,
        subtotal: (
          parseFloat(item.quantity) * parseFloat(item.sellingPrice)
        ).toString(),
      }))
    );
  };

  const calcDiscount = useCallback(() => {
    const total = data?.reduce((acc, item) => {
      return acc + Number(item.discountPrice) * Number(item.quantity);
    }, 0);

    setDiscount(total);
  }, [data]);

  const calcTotal = useCallback(() => {
    const total = data?.reduce((acc, item) => {
      return acc + Number(item.sellingPrice) * Number(item.quantity);
    }, 0);

    setTotal(total);
  }, [data]);

  useEffect(() => {
    calcTotal();
    calcDiscount();
  }, [calcDiscount, calcTotal, data]);

  const handleFormChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
    i: number
  ) => {
    // Get the name and value from the event
    const name = e.target.name as keyof changedValType;
    const value = e.target.value;

    // Copy the existing order data
    const changedVal: changedValType[] = [...data];
    changedVal[i][name] = value;

    // If we are changing product inputs, then we want to pre-populate other fields that are tied to the selected product.
    let filteredProduct;
    if (e.target.name === 'product') {
      filteredProduct = products.filter((item: ProductTypes) => {
        return item._id === e.target.value;
      })[0];

      changedVal[i].sellingPrice = filteredProduct?.sellingPrice;

      changedVal[i].discountPrice = filteredProduct?.discountPrice
        ? `${filteredProduct?.sellingPrice - filteredProduct?.discountPrice}`
        : '';

      changedVal[i].productName = filteredProduct?.productName;

      // Get color based on the selected product.
      const updatedColors = [...colors];
      updatedColors[i] = filteredProduct?.color;
      // Get sizes based on the selected product.
      const updatedSizes = [...sizes];
      updatedSizes[i] = filteredProduct?.size;

      setColors(updatedColors);
      setSizes(updatedSizes);
    }
    setData(changedVal);
    calculateSubTotals();
    setIsProductChange(true);
  };

  const handleOtherChange = (
    e:
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLInputElement>,
    i: number
  ) => {
    if (e.target.name === 'color') {
      const newData = [...data];
      newData[i].color = e.target.value;
      setData(newData);
    }
    if (e.target.name === 'size') {
      const newData = [...data];
      newData[i].size = e.target.value;
      setData(newData);
    }

    if (e.target.name === 'quantity') {
      const newData = [...data];
      newData[i].quantity = e.target.value;
      setData(newData);
      calculateSubTotals();
      calcDiscount();
      calcTotal();
    }
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('customerId', user._id);
    formData.append('orderName', user.fullName);
    formData.append('email', salesOrder.user.email);
    formData.append('phone', phone);
    formData.append('address', address);
    formData.append('orders', JSON.stringify(data));
    submit(formData, { method: 'PATCH' });
  };

  return (
    <>
      <Helmet>
        <title>MettyHair - Update Sales Order</title>
      </Helmet>
      <AdminSection>
        {/* Header */}
        <AdminHeader>
          <h4>Update order: SO-{salesOrder.orderNo.toUpperCase()}</h4>
          <Link to='/admin/account/sales-orders'>Sales Orders</Link>
        </AdminHeader>

        <>
          {/* header */}
          {salesOrder.orderStatus !== 'pending' && (
            <FormError
              info={
                'This order has already been invoiced and cannot be edited.'
              }
            />
          )}
          <OrderLabel>customer details</OrderLabel>
          <ThreeGrid>
            <AFormGroup>
              <Label htmlFor='customer' type='dark'>
                customer
              </Label>
              <Input
                type='customer'
                id='customer'
                name='customer'
                defaultValue={user.fullName}
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
                $dark
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
                defaultValue={address || ''}
                onChange={(e) => setAddress(e.target.value)}
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
            {data.map((val, index) => {
              // console.log(val);

              return (
                <OrderGrid key={index} $isAction>
                  <AFormGroup className='mb-0'>
                    <Select
                      $width='100%'
                      $bg='var(--admin-input-bg)'
                      name='product'
                      value={val.product}
                      onChange={(e) => handleFormChange(e, index)}
                      disabled={salesOrder.orderStatus !== 'pending'}
                    >
                      {!isProductChange && (
                        <option value={val.product} hidden>
                          {val.productName}
                        </option>
                      )}
                      {products.map((product: ProductTypes) => (
                        <option value={product._id} key={product._id}>
                          {product.productName}
                        </option>
                      ))}
                    </Select>
                  </AFormGroup>
                  {/* color */}
                  <AFormGroup className='mb-0'>
                    <Select
                      $width='100%'
                      $bg='var(--admin-input-bg)'
                      name='color'
                      onChange={(e) => handleOtherChange(e, index)}
                      disabled={salesOrder.orderStatus !== 'pending'}
                    >
                      {!isProductChange && (
                        <option value={val.color}>{val.color}</option>
                      )}

                      {colors[index]
                        .split(',')
                        ?.map((color: string, index: number) => (
                          <option value={color} key={index}>
                            {color}
                          </option>
                        ))}
                    </Select>
                  </AFormGroup>
                  {/* Sizes */}
                  <AFormGroup className='mb-0'>
                    <Select
                      $width='100%'
                      $bg='var(--admin-input-bg)'
                      name='color'
                      onChange={(e) => handleOtherChange(e, index)}
                      disabled={salesOrder.orderStatus !== 'pending'}
                    >
                      {!isProductChange && (
                        <option value={val.size}>{val.size}</option>
                      )}

                      {sizes[index]
                        ?.split(',')
                        ?.map((size: string, index: number) => (
                          <option value={size} key={index}>
                            {size}
                          </option>
                        ))}
                    </Select>
                  </AFormGroup>

                  <AFormGroup className='mb-0'>
                    <Input
                      type='number'
                      id={`quantity-${index + 1}`}
                      $dark
                      name='quantity'
                      value={val.quantity}
                      onChange={(e) => handleOtherChange(e, index)}
                      disabled={salesOrder.orderStatus !== 'pending'}
                    />
                  </AFormGroup>
                  <AFormGroup className='mb-0'>
                    <Input
                      type='text'
                      id={`price-${index + 1}`}
                      $dark
                      name='price'
                      value={val.sellingPrice}
                      onChange={() => {}}
                      disabled={salesOrder.orderStatus !== 'pending'}
                    />
                  </AFormGroup>
                  <AFormGroup className='mb-0'>
                    <Input
                      type='text'
                      id={`subtotal-${index + 1}`}
                      $dark
                      name='subtotal'
                      value={isNaN(+val.subtotal) ? 0 : val.subtotal}
                      onChange={() => {}}
                      disabled={salesOrder.orderStatus !== 'pending'}
                    />
                  </AFormGroup>
                </OrderGrid>
              );
            })}
          </div>
          {total && (
            <ProductTotal
              showHeader={false}
              marginTop='0'
              btnType='btn'
              isOrder={true}
              isDark={true}
              hideBtn={true}
              productTotal={{
                subtotal: total,
                totalDiscount: discount,
              }}
            />
          )}
          {salesOrder.orderStatus === 'pending' && (
            <Button
              type='button'
              btnText='Update Order'
              icon={<FaPlus />}
              onBtnTrigger={handleSubmit}
            />
          )}
        </>
      </AdminSection>
    </>
  );
};

export default EditClientOrder;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  await queryClient.ensureQueryData({
    queryKey: ['fetchOrder', 'clientOrder', params.id],
    queryFn: () =>
      getOnlyData({
        url: `/sales-orders/${params.id}`,
      }),
  });

  await queryClient.ensureQueryData({
    queryKey: ['fetchProduct', 'products'],
    queryFn: () =>
      getOnlyData({ url: '/products?isActive=true&quantity[gt]=0' }),
  });

  return params;
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const data = await extractFormData(request);

  return updateData({
    url: `/sales-orders/${params.id}`,
    data,
    setToast: true,
    invalidate: ['fetchOrder'],
    redirectTo: '/my-dashboard',
  });
};
