/* eslint-disable react-refresh/only-export-components */
import {
  ActionFunctionArgs,
  Form,
  Link,
  useActionData,
} from 'react-router-dom';
import {
  AdminHeader,
  AdminSection,
  AFormGroup,
  ThreeGrid,
  TwoGrid,
} from '../../../features/adminNavLayouts/AdminUtils';
import Input, { Label } from '../../../ui/Input';
import { Select } from '../../../ui/SelectInput';
import {
  extractFormData,
  getOnlyData,
  postData,
  queryClient,
} from '../../../api/requests';
import { useQuery } from '@tanstack/react-query';
import { User } from '../../../dtos/userDto';
import Button from '../../../ui/Button';
import { FaSave } from 'react-icons/fa';
import FormError from '../../../ui/FormError';
import { InfoType } from '../../../dtos/utilsDto';
import { OrderLabel } from '../../../features/adminAccount/adminOrderStyles';
import { formatNumber } from '../../../utilities/HelperFunc';
import React from 'react';

type SettledInvoiceType = {
  invoice?: string;
  balance?: number;
  amountSettled?: number;
};

export type ActionDataTypes = SettledInvoiceType[] | InfoType;

const PostPayment = () => {
  const actionData = useActionData();
  const { settledInvoices } =
    (actionData as {
      settledInvoices: SettledInvoiceType[];
    }) || [];
  console.log(actionData);

  const { data: usersData } = useQuery({
    queryKey: ['users'],
    queryFn: () => getOnlyData({ url: '/users' }),
  });

  const { users }: { users: User[] } = usersData;

  return (
    <AdminSection>
      <AdminHeader>
        <h4>Post Payment</h4>
        <Link to='/admin/account'>Account Dashboard</Link>
      </AdminHeader>
      <Form id='form' method='post'>
        {(actionData as InfoType)?.status === 'fail' && (
          <FormError info={(actionData as InfoType)?.message} />
        )}

        {settledInvoices?.length > 0 && (
          <div className='border-new'>
            <h4 className='admin-color text-center accessmgr-group mb-2'>
              Settled Invoices
            </h4>
            <ThreeGrid>
              <>
                <OrderLabel>Invoice No.</OrderLabel>
                <OrderLabel>Balance</OrderLabel>
                <OrderLabel>amount settled</OrderLabel>
              </>
              {settledInvoices?.length > 0 &&
                settledInvoices?.map((item) => {
                  return (
                    <React.Fragment key={item.invoice}>
                      <p className='admin-color fs-14'>INV-{item.invoice}</p>
                      <p className='admin-color fs-14'>
                        {formatNumber(item.balance || 0)}
                      </p>
                      <p className='admin-color fs-14'>
                        {formatNumber(item.amountSettled || 0)}
                      </p>
                    </React.Fragment>
                  );
                })}
            </ThreeGrid>
          </div>
        )}

        {settledInvoices?.length === 0 && (
          <div className='border-new'>
            <p className='admin-color fs-14'>
              No unsettled invoice for the payment made. The system will
              automatically match payment once new invoice is generate.
            </p>
          </div>
        )}

        <TwoGrid>
          <AFormGroup>
            <Label htmlFor='user' type='dark'>
              customer
            </Label>
            <Select
              $width='100%'
              $bg='var(--admin-input-bg)'
              name='user'
              id='user'
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
            <Label htmlFor='payment' type='dark'>
              payment (NGN)
            </Label>
            <Input type='number' id='payment' $dark name='payment' />
          </AFormGroup>
        </TwoGrid>
        <Button btnText='post' icon={<FaSave />} />
      </Form>
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

export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await extractFormData(request);
  return postData({
    url: `/sales-orders/pay`,
    data,
    invalidate: ['fetchOrder'],
  });
};
