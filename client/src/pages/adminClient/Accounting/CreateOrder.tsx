/* eslint-disable react-refresh/only-export-components */
import { ActionFunctionArgs, Link, useSubmit } from 'react-router-dom';
import {
  AdminHeader,
  AdminSection,
  AFormGroup,
  ThreeGrid,
} from '../../../features/adminNavLayouts/AdminUtils';
import Input, { Label } from '../../../ui/Input';
import { Select } from '../../../ui/SelectInput';
import ProductTotal from '../../../features/shoppingCart/ProductTotal';
import {
  BtnUI,
  FiveGrid,
} from '../../../features/adminAccount/adminOrderStyles';
import { FaPlus, FaTimes } from 'react-icons/fa';
import Button from '../../../ui/Button';
import {
  extractFormData,
  getOnlyData,
  postData,
  queryClient,
} from '../../../api/requests';
import { useQuery } from '@tanstack/react-query';
import { User } from '../../../dtos/userDto';
import { useState } from 'react';
import { ProductTypes } from '../../../dtos/productsDto';
import { slugifyText } from '../../../utilities/HelperFunc';

const CreateOrder = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [data, setData] = useState<changedValType[]>([
    { productId: '', product: '', quantity: '1', price: '', subtotal: '' },
  ]);
  const [total, setTotal] = useState(0);
  const submit = useSubmit();

  const {
    data: { users },
  } = useQuery({
    queryKey: ['users'],
    queryFn: () => getOnlyData({ url: '/users' }),
  });

  const {
    data: { products },
  } = useQuery({
    queryKey: ['fetchProduct', 'products'],
    queryFn: () => getOnlyData({ url: '/products' }),
  });

  type changedValType = {
    productId: string;
    product: string;
    quantity: string;
    price: string;
    subtotal: string;
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const filteredUser = users
      .filter((user: User) => user._id === e.target.value)
      .at(0);

    setEmail(filteredUser.email);
    if (filteredUser.phone) {
      setPhone(filteredUser.phone);
    } else {
      setPhone('');
    }
    if (filteredUser.address) {
      setAddress(
        `${filteredUser.address}, ${filteredUser.state}, ${filteredUser.country}`
      );
    } else {
      setAddress('');
    }
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

  const calcTotal = () => {
    const total = data.reduce((acc, item) => {
      return acc + Number(item.price) * Number(item.quantity);
    }, 0);

    setTotal(total);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    i: number
  ) => {
    const name = e.target.name as keyof changedValType;
    const value = e.target.value;
    const changedVal: changedValType[] = [...data];
    changedVal[i][name] = value;

    if (e.target.name === 'product') {
      const filteredProduct = products.filter((item: ProductTypes) => {
        return item.slug === slugifyText(e.target.value);
      })[0];

      changedVal[i].price = filteredProduct.discountPrice
        ? filteredProduct.discountPrice
        : filteredProduct.sellingPrice;

      changedVal[i].productId = filteredProduct._id;
    }
    // console.log();

    setData(changedVal);
    calculateSubTotals();
    calcTotal();
  };

  const handleInputAdd = () => {
    setData([
      ...data,
      { productId: '', product: '', quantity: '1', price: '', subtotal: '' },
    ]);
  };

  const handleDelete = (i: number) => {
    const deletedVal = [...data];
    deletedVal.splice(i, 1);
    setData(deletedVal);
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('address', address);
    formData.append('orders', JSON.stringify(data));
    submit(formData, { method: 'POST' });
  };

  console.log(data);

  return (
    <AdminSection>
      {/* Header */}
      <AdminHeader>
        <h4>Create order</h4>
        <Link to='/admin/account'>Account dashboard</Link>
      </AdminHeader>

      <>
        {/* header */}
        <h4>Customer Details</h4>
        <ThreeGrid>
          <AFormGroup>
            <Label htmlFor='customer' type='dark'>
              customer
            </Label>
            <Select
              $width='100%'
              $bg='var(--admin-input-bg)'
              name='customer'
              id='customer'
              onChange={handleChange}
            >
              <option value='' hidden>
                Select customer
              </option>
              {users.map((customer: User) => (
                <option value={customer._id} key={customer._id}>
                  {customer.fullName}
                </option>
              ))}
            </Select>
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
              defaultValue={email}
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
              defaultValue={phone}
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
            />
          </AFormGroup>
        </ThreeGrid>

        {/* Customer order section */}
        <h4>Customer Order</h4>
        <BtnUI type='button' onClick={handleInputAdd}>
          Add +
        </BtnUI>

        <div style={{ overflowX: 'auto', margin: '2rem 0 2rem 0' }}>
          <FiveGrid>
            <Label type='dark'>product</Label>
            <Label type='dark'>quantity</Label>
            <Label type='dark'>price</Label>
            <Label type='dark'>subtotal</Label>
            <Label type='dark'>action</Label>
          </FiveGrid>
          {data.map((val, index) => {
            return (
              <FiveGrid key={index}>
                <AFormGroup>
                  <Input
                    list={`product-${index + 1}`}
                    name='product'
                    $dark
                    $capitalize={true}
                    value={val.product}
                    onChange={(e) => handleFormChange(e, index)}
                    placeholder='Search product'
                  />
                  <datalist id={`product-${index + 1}`}>
                    {products.map((product: ProductTypes) => {
                      return (
                        <option
                          value={product.productName}
                          key={product._id}
                        ></option>
                      );
                    })}
                  </datalist>
                </AFormGroup>
                <AFormGroup>
                  <Input
                    type='text'
                    id={`quantity-${index + 1}`}
                    $dark
                    name='quantity'
                    value={val.quantity}
                    onChange={(e) => handleFormChange(e, index)}
                  />
                </AFormGroup>
                <AFormGroup>
                  <Input
                    type='text'
                    id={`price-${index + 1}`}
                    $dark
                    name='price'
                    defaultValue={val.price}
                  />
                </AFormGroup>
                <AFormGroup>
                  <Input
                    type='text'
                    id={`subtotal-${index + 1}`}
                    $dark
                    name='subtotal'
                    defaultValue={isNaN(+val.subtotal) ? 0 : val.subtotal}
                  />
                </AFormGroup>
                <AFormGroup style={{ display: 'flex', alignItems: 'center' }}>
                  <BtnUI type='button' onClick={() => handleDelete(index)}>
                    <FaTimes />
                  </BtnUI>
                </AFormGroup>
              </FiveGrid>
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
              totalDiscount: 0,
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

export default CreateOrder;

export const loader = async () => {
  await queryClient.ensureQueryData({
    queryKey: ['users'],
    queryFn: () => getOnlyData({ url: '/users' }),
  });

  await queryClient.ensureQueryData({
    queryKey: ['fetchProduct', 'products'],
    queryFn: () => getOnlyData({ url: '/products' }),
  });

  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await extractFormData(request);
  return postData({
    url: '/sales-orders',
    data,
  });

  return null;
};
