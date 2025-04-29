/* eslint-disable react-refresh/only-export-components */

import { IoReloadCircleOutline } from 'react-icons/io5';

import { ActionFunctionArgs, Form, useActionData } from 'react-router-dom';
import { FaDownload } from 'react-icons/fa';
import { User } from '../../../dtos/userDto';
import { TransactionType } from '../../../dtos/statementDto';
import FormError from '../../../ui/FormError';
import {
  AdminSection,
  AFormGroup,
  ThreeGrid,
} from '../../../features/adminNavLayouts/AdminUtils';
import Input, { Label } from '../../../ui/Input';
import Button from '../../../ui/Button';
import { StatementBox } from '../../../features/products/ClientStatementStyles';
import { formatDate, formatNumber } from '../../../utilities/HelperFunc';
import { OrderLabel } from '../../../features/adminAccount/adminOrderStyles';
import {
  extractFormData,
  getOnlyData,
  postData,
  queryClient,
} from '../../../api/requests';
import { Select } from '../../../ui/SelectInput';
import { useQuery } from '@tanstack/react-query';
import Empty from '../../../ui/Empty';
import generatePDF, { Resolution, Margin, usePDF } from 'react-to-pdf';
import { useState } from 'react';

const CustomerStatement = () => {
  const [customerDetails, setCustomerDetails] = useState<User>();
  const data = useActionData() as TransactionType;
  const options = {
    resolution: Resolution.HIGH,
    margin: Margin.MEDIUM,
  };
  const { targetRef } = usePDF({ filename: 'customerStatement.pdf' });

  const {
    data: { users },
  } = useQuery({
    queryKey: ['users'],
    queryFn: () => getOnlyData({ url: '/users?role=wholesaler' }),
  });

  let runningBalance = data?.openingBal || 0;

  const balance =
    data?.statement?.reduce((acc, curr) => {
      if (curr.orderId) return acc + curr.amount;
      if (curr.paymentId) return acc - curr.amount;
      return acc;
    }, 0) || 0;

  const openingBalance = data?.openingBal || 0;
  const totalBalance = balance + openingBalance;

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUser = users.find(
      (user: User) => user._id === e.target.value
    );
    setCustomerDetails(selectedUser);
  };

  return (
    <AdminSection style={{ padding: '2rem' }}>
      <Form method='post' id='form'>
        <div className='mt-3'>
          {data?.status === 'fail' && <FormError info={data?.message} />}
        </div>
        <ThreeGrid>
          <AFormGroup>
            <Label htmlFor='user' type='dark'>
              Customer
            </Label>
            <Select
              $width='100%'
              $bg='var(--admin-input-bg)'
              name='user'
              id='user'
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
            <Label htmlFor='startDate' type='dark'>
              start date
            </Label>
            <Input type='date' id='startDate' name='startDate' $dark />
          </AFormGroup>
          <AFormGroup>
            <Label htmlFor='endDate' type='dark'>
              end date
            </Label>
            <Input type='date' id='endDate' name='endDate' $dark />
          </AFormGroup>
          <AFormGroup
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Button btnText='generate' icon={<IoReloadCircleOutline />} />
          </AFormGroup>
        </ThreeGrid>
      </Form>
      {data?.statement && data?.statement?.length > 0 ? (
        <>
          <div className='center-obj mb-2'>
            <Button
              btnText='download PDF'
              icon={<FaDownload />}
              wide='20rem'
              onBtnTrigger={() => generatePDF(targetRef, options)}
            />
          </div>
          <StatementBox id='statement' ref={targetRef}>
            <div className='text-center color-red'>
              <h3>Metty General Merchant</h3>
              <p className='text-center fw-500'>Customer Statement</p>
            </div>
            <div className='header color'>
              <div className='header-box'>
                <span>Customer Name:</span>
                <span>{customerDetails?.fullName}</span>
              </div>
              <div className='header-box'>
                <span>Opening Balance:</span>
                <span>&#8358;{formatNumber(data?.openingBal) || 0}</span>
              </div>
              <div className='header-box'>
                <span>Closing Balance:</span>
                <span>&#8358;{formatNumber(totalBalance)}</span>
              </div>
            </div>
            <div className='box'>
              <div className='grid accessmgr-group fw-500'>
                <OrderLabel className='color'>date</OrderLabel>
                <OrderLabel className='color'>Transaction id</OrderLabel>
                <OrderLabel className='color'>Debit</OrderLabel>
                <OrderLabel className='color'>Credit</OrderLabel>
                <OrderLabel className='color'>Balance</OrderLabel>
              </div>
              <div>
                <div className='grid fw-500 lines'>
                  <p></p>
                  <p>Opening balance</p>
                  <p></p>
                  <p></p>
                  <p>{formatNumber(data?.openingBal) || 0}</p>
                </div>
                {data?.statement?.map((item) => {
                  // To calculate the running balance for the statement
                  if (item.orderId) runningBalance += item.amount;
                  if (item.paymentId) runningBalance -= item.amount;

                  return (
                    <div
                      className={`grid lines evenLines ${
                        data.noHits && 'color'
                      }`}
                      key={item._id}
                    >
                      <p>{formatDate(new Date(item.date))}</p>
                      <p>
                        {item.orderId
                          ? `INV-${item.orderId.invoiceNo.toUpperCase()}`
                          : `PAY-${item.paymentId?.paymentId.toUpperCase()}`}
                      </p>
                      <p>{item.orderId ? formatNumber(item.amount) : '-'}</p>
                      <p>{item.paymentId ? formatNumber(item.amount) : '-'}</p>
                      <p>{formatNumber(runningBalance)}</p>
                    </div>
                  );
                })}
              </div>
              <div className='grid fw-500 color'>
                <p></p>
                <p>Closing balance</p>
                <p></p>
                <p></p>
                <p>{formatNumber(totalBalance)}</p>
              </div>
            </div>
          </StatementBox>
        </>
      ) : (
        <Empty
          type='dark'
          message='No record to display for this customer.'
          showLink={false}
        />
      )}
    </AdminSection>
  );
};

export default CustomerStatement;

export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await extractFormData(request);

  return postData({
    url: '/reports/statement',
    data,
  });
};

export const loader = () => {
  return queryClient.ensureQueryData({
    queryKey: ['users'],
    queryFn: () => getOnlyData({ url: '/users?role=wholesaler' }),
  });
};
