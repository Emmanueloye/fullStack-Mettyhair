/* eslint-disable react-refresh/only-export-components */
import { Link } from 'react-router-dom';
import {
  AdminHeader,
  AdminSection,
  AFormGroup,
  ThreeGrid,
} from '../../../features/adminNavLayouts/AdminUtils';
import Input, { Label } from '../../../ui/Input';
import { Select } from '../../../ui/SelectInput';
import { getData, getOnlyData, queryClient } from '../../../api/requests';
import { useQuery } from '@tanstack/react-query';
import { User } from '../../../dtos/userDto';
import { useState } from 'react';
import { OrderType } from '../../../dtos/orderDto';
import {
  FourGrid,
  OrderLabel,
} from '../../../features/adminAccount/adminOrderStyles';
import { formatNumber } from '../../../utilities/HelperFunc';

const PostPayment = () => {
  const [email, setEmail] = useState<string>();
  const [invoices, setInvoices] = useState<OrderType[]>();
  const { data: usersData } = useQuery({
    queryKey: ['users'],
    queryFn: () => getOnlyData({ url: '/users' }),
  });

  const { users }: { users: User[] } = usersData;

  const handleUserChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUser = users.find((item) => item._id === e.target.value);

    const unsettledInvoices = await getData({
      url: `/sales-orders?orderStatus=invoiced&paymentStatus=unpaid&paymentStatus=partial&user=${e.target.value}`,
    });

    setInvoices(unsettledInvoices.salesOrders);

    setEmail(selectedUser!.email);
  };
  console.log(invoices);

  return (
    <AdminSection>
      <AdminHeader>
        <h4>Post Payment</h4>
        <Link to='/admin/account'>Account Dashboard</Link>
      </AdminHeader>
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
            onChange={handleUserChange}
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
          <Label htmlFor='amountPaid' type='dark'>
            payment (NGN)
          </Label>
          <Input type='number' id='amountPaid' $dark name='amountPaid' />
        </AFormGroup>
      </ThreeGrid>
      {invoices?.map((invoice) => {
        const totalAmountPaid = invoice.amountPaid.reduce(
          (acc, curr) => acc + curr,
          0
        );
        return (
          <FourGrid key={invoice._id}>
            <input type='checkbox' defaultValue={invoice._id} name='orderId' />
            <OrderLabel>{invoice.invoiceNo}</OrderLabel>
            <OrderLabel>
              {formatNumber(invoice.totalAmount) || '0.00'}
            </OrderLabel>
            <OrderLabel>{formatNumber(totalAmountPaid) ?? '0.00'}</OrderLabel>
            <OrderLabel>
              {formatNumber(invoice.totalAmount - totalAmountPaid) ?? '0.00'}
            </OrderLabel>
          </FourGrid>
        );
      })}
    </AdminSection>
  );
};

export default PostPayment;

export const loader = async () => {
  return queryClient.ensureQueryData({
    queryKey: ['users'],
    queryFn: () => getOnlyData({ url: '/users' }),
  });
};
