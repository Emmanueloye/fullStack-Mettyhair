/* eslint-disable react-refresh/only-export-components */

import { IoReloadCircleOutline } from 'react-icons/io5';
import {
  AFormGroup,
  ThreeGrid,
} from '../../features/adminNavLayouts/AdminUtils';
import Button from '../../ui/Button';
import Input, { Label } from '../../ui/Input';
import { OrderLabel } from '../../features/adminAccount/adminOrderStyles';
import { StatementBox } from '../../features/products/ClientStatementStyles';
import {
  ActionFunctionArgs,
  Form,
  useActionData,
  useOutletContext,
} from 'react-router-dom';
import { User } from '../../dtos/userDto';
import { extractFormData, postData } from '../../api/requests';
import { TransactionType } from '../../dtos/statementDto';
import FormError from '../../ui/FormError';
import { formatDate, formatNumber } from '../../utilities/HelperFunc';
import Empty from '../../ui/Empty';
import DownloadStatement from '../../features/downloads/DownloadStatement';
import { Helmet } from 'react-helmet-async';

const ClientStatement = () => {
  const user = useOutletContext<User>();
  const data = useActionData() as TransactionType;

  let runningBalance = data?.openingBal || 0;

  const balance =
    data?.statement?.reduce((acc, curr) => {
      if (curr?.orderId) return acc + curr.amount;
      if (curr?.paymentId) return acc - curr.amount;
      return acc;
    }, 0) || 0;

  const openingBalance = data?.openingBal || 0;
  const totalBalance = balance + openingBalance;

  return (
    <>
      <Helmet>
        <title>MettyHair - Products by Categories</title>
      </Helmet>
      <Form method='post' id='form'>
        <div className='mt-3'>
          {data?.status === 'fail' && <FormError info={data?.message} />}
        </div>
        <ThreeGrid>
          <input type='hidden' defaultValue={user?._id} name='user' />
          <AFormGroup>
            <Label htmlFor='startDate'>start date</Label>
            <Input type='date' id='startDate' name='startDate' />
          </AFormGroup>
          <AFormGroup>
            <Label htmlFor='endDate'>end date</Label>
            <Input type='date' id='endDate' name='endDate' />
          </AFormGroup>
          <AFormGroup
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: '3.5rem',
            }}
          >
            <Button btnText='generate' icon={<IoReloadCircleOutline />} />
          </AFormGroup>
        </ThreeGrid>
      </Form>
      {data?.statement && data?.statement?.length > 0 ? (
        <>
          <div className='center-obj mb-2'>
            <DownloadStatement
              closingBal={totalBalance}
              openingBal={openingBalance}
              customerDetails={user}
              statementContent={data?.statement}
            />
          </div>
          <StatementBox id='statement'>
            <div className='text-center color-red'>
              <h3>Metty General Merchant</h3>
              <p className='text-center fw-500'>Customer Statement</p>
            </div>
            <div className='header'>
              <div className='header-box'>
                <span>Customer Name:</span>
                <span>{user?.fullName}</span>
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
                <OrderLabel>date</OrderLabel>
                <OrderLabel>Transaction id</OrderLabel>
                <OrderLabel>Debit</OrderLabel>
                <OrderLabel>Credit</OrderLabel>
                <OrderLabel>Balance</OrderLabel>
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
                    <div className='grid lines' key={item._id}>
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
              <div className='grid fw-500'>
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
          message='No data available for the selected date range.'
          showLink={false}
        />
      )}
    </>
  );
};

export default ClientStatement;

export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await extractFormData(request);

  return postData({
    url: '/reports/statement',
    data,
  });
};

export const loader = () => {
  return null;
};
