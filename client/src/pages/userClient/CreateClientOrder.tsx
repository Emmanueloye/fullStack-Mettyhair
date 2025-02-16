/* eslint-disable react-refresh/only-export-components */
import {
  ActionFunctionArgs,
  Link,
  useActionData,
  useOutletContext,
  useSubmit,
} from 'react-router-dom';
import {
  extractFormData,
  getOnlyData,
  postData,
  queryClient,
} from '../../api/requests';
import { InfoType } from '../../dtos/utilsDto';
import { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { User } from '../../dtos/userDto';
import { ProductTypes } from '../../dtos/productsDto';
import {
  AdminHeader,
  AdminSection,
  AFormGroup,
  ThreeGrid,
} from '../../features/adminNavLayouts/AdminUtils';
import FormError from '../../ui/FormError';
import {
  BtnUI,
  OrderGrid,
  OrderLabel,
} from '../../features/adminAccount/adminOrderStyles';
import Input, { Label } from '../../ui/Input';
import { Select } from '../../ui/SelectInput';
import { FaPlus, FaTimes } from 'react-icons/fa';
import ProductTotal from '../../features/shoppingCart/ProductTotal';
import Button from '../../ui/Button';

const CreateClientOrder = () => {
  const user = useOutletContext<User>();
  const error = useActionData() as InfoType;
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [phone, setPhone] = useState(user.phone || '');
  const [address, setAddress] = useState(user.address || '');
  const [data, setData] = useState<changedValType[]>([
    {
      product: '',
      color: '',
      size: '',
      quantity: '1',
      price: '',
      subtotal: '',
      discountPrice: '',
    },
  ]);
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const submit = useSubmit();

  const { data: productsData } = useQuery({
    queryKey: ['fetchProduct', 'products'],
    queryFn: () =>
      getOnlyData({ url: '/products?isActive=true&quantity[gt]=0' }),
  });

  const { products } = productsData || {};

  type changedValType = {
    product: string;
    color: string;
    size: string;
    quantity: string;
    price: string;
    subtotal: string;
    discountPrice?: string;
  };

  const calculateSubTotals = () => {
    // Update the state with the new data including subtotals
    setData(
      data.map((item) => ({
        ...item,
        subtotal: (
          parseFloat(item.quantity) * parseFloat(item.price)
        ).toString(),
      }))
    );
  };

  const calcDiscount = useCallback(() => {
    const total = data.reduce((acc, item) => {
      return acc + Number(item.discountPrice) * Number(item.quantity);
    }, 0);

    setDiscount(total);
  }, [data]);

  const calcTotal = useCallback(() => {
    const total = data.reduce((acc, item) => {
      return acc + Number(item.price) * Number(item.quantity);
    }, 0);

    setTotal(total);
  }, [data]);

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

      changedVal[i].price = filteredProduct?.sellingPrice;

      changedVal[i].discountPrice = filteredProduct?.discountPrice
        ? `${filteredProduct?.sellingPrice - filteredProduct?.discountPrice}`
        : '';

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
  };

  useEffect(() => {
    calcDiscount();
    calcTotal();
  }, [calcDiscount, calcTotal, data]);

  const handleInputAdd = () => {
    setData([
      ...data,
      {
        product: '',
        color: '',
        size: '',
        quantity: '1',
        price: '',
        subtotal: '',
        discountPrice: '',
      },
    ]);
  };

  const handleDelete = (i: number) => {
    // Make a copy of each of these states
    const deletedVal = [...data];
    const updatedColors = [...colors];
    const updatedSizes = [...sizes];

    // Delete the part of the array not required.
    deletedVal.splice(i, 1);
    updatedColors.splice(i, 1);
    updatedSizes.splice(i, 1);

    // Set the states to trigger re-render.
    setData(deletedVal);
    setColors(updatedColors);
    setSizes(updatedSizes);
  };
  // HTMLSelectElement;
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
    formData.append('email', user.email);
    formData.append('phone', `${phone}`);
    formData.append('address', address);
    formData.append('orders', JSON.stringify(data));
    submit(formData, { method: 'POST' });
  };

  return (
    <AdminSection>
      {/* Header */}
      <AdminHeader>
        <h4>Create order</h4>
        <Link to='/my-dashboard/all-orders'>All Orders</Link>
      </AdminHeader>

      <>
        {/* header */}

        {error && <FormError info={error.message} />}

        <OrderLabel>customer details</OrderLabel>
        <ThreeGrid>
          <AFormGroup>
            <Label htmlFor='customer'>customer</Label>
            <Input
              type='customer'
              id='customer'
              $dark
              name='customer'
              defaultValue={user.fullName}
            />
          </AFormGroup>
          <AFormGroup>
            <Label htmlFor='email'>Email</Label>
            <Input
              type='email'
              id='email'
              $dark
              name='email'
              defaultValue={user.email}
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
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </AFormGroup>
          <AFormGroup>
            <Label htmlFor='address'>address</Label>
            <Input
              type='text'
              id='address'
              name='address'
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </AFormGroup>
        </ThreeGrid>

        {/* Customer order section */}
        <OrderLabel className='mb-2'>customer order</OrderLabel>
        <BtnUI type='button' onClick={handleInputAdd}>
          Add +
        </BtnUI>

        <div style={{ overflowX: 'auto', margin: '2rem 0 2rem 0' }}>
          {/* Header */}
          <OrderGrid type='dark'>
            <OrderLabel>product</OrderLabel>
            <OrderLabel>color</OrderLabel>
            <OrderLabel>size</OrderLabel>
            <OrderLabel>quantity</OrderLabel>
            <OrderLabel>price</OrderLabel>
            <OrderLabel>subtotal</OrderLabel>
            <OrderLabel>action</OrderLabel>
          </OrderGrid>
          {/* Dynamic inputs */}
          {data?.map((val, index) => {
            return (
              <OrderGrid key={index}>
                <AFormGroup className='mb-0'>
                  <Select
                    $width='100%'
                    $bg='var(--admin-input-bg)'
                    name='product'
                    value={val.product}
                    onChange={(e) => handleFormChange(e, index)}
                  >
                    <option value='' hidden>
                      Select products
                    </option>
                    {products?.map((product: ProductTypes) => (
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
                  >
                    <option value='' hidden>
                      Select color
                    </option>
                    {colors[index]
                      ?.split(',')
                      ?.map((color: string, index: number) => (
                        <option value={color} key={index}>
                          {color}
                        </option>
                      ))}
                  </Select>
                </AFormGroup>

                {/* sizes */}
                <AFormGroup className='mb-0'>
                  <Select
                    $width='100%'
                    $bg='var(--admin-input-bg)'
                    name='size'
                    onChange={(e) => handleOtherChange(e, index)}
                  >
                    <option value='' hidden>
                      Select size
                    </option>
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
                    min={1}
                    value={val.quantity}
                    onChange={(e) => handleOtherChange(e, index)}
                  />
                </AFormGroup>
                <AFormGroup className='mb-0'>
                  <Input
                    type='text'
                    id={`price-${index + 1}`}
                    $dark
                    name='price'
                    defaultValue={val.price}
                  />
                </AFormGroup>
                <AFormGroup className='mb-0'>
                  <Input
                    type='text'
                    id={`subtotal-${index + 1}`}
                    $dark
                    name='subtotal'
                    defaultValue={isNaN(+val.subtotal) ? 0 : val.subtotal}
                  />
                </AFormGroup>
                <AFormGroup
                  style={{ display: 'flex', alignItems: 'center' }}
                  className='mb-0'
                >
                  <BtnUI type='button' onClick={() => handleDelete(index)}>
                    <FaTimes />
                  </BtnUI>
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
        <Button
          type='button'
          btnText='create Order'
          icon={<FaPlus />}
          onBtnTrigger={handleSubmit}
        />
      </>
    </AdminSection>
  );
};

export default CreateClientOrder;

export const loader = async () => {
  await queryClient.ensureQueryData({
    queryKey: ['fetchProduct', 'products'],
    queryFn: () =>
      getOnlyData({ url: '/products?isActive=true&quantity[gt]=0' }),
  });

  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await extractFormData(request);
  return postData({
    url: '/sales-orders',
    data,
    invalidate: ['fetchOrder'],
    redirectTo: '/my-dashboard',
  });
};
