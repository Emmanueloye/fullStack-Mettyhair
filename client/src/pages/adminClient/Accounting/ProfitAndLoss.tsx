import { Link } from 'react-router-dom';
import {
  AdminHeader,
  AdminSection,
  AFormGroup,
  ThreeGrid,
} from '../../../features/adminNavLayouts/AdminUtils';
import Input, { Label } from '../../../ui/Input';
import Button from '../../../ui/Button';
import { IoReloadCircleOutline } from 'react-icons/io5';
import {
  PandLBox,
  PandLWrapper,
} from '../../../features/adminAccount/adminOrderStyles';
import { useRef, useState } from 'react';
import { postData } from '../../../api/requests';
import { OrderType } from '../../../dtos/orderDto';
import { ExpenseSummaryType } from '../../../dtos/ExpenseHeadDto';
import { formatDate, formatNumber } from '../../../utilities/HelperFunc';
import FormError from '../../../ui/FormError';
import Empty from '../../../ui/Empty';

const ProfitAndLoss = () => {
  const [report, setReport] = useState<{
    status: string;
    revenue: OrderType[];
    expenses: ExpenseSummaryType[];
    message: string;
  }>();
  const [isLoading, setIsLoading] = useState(false);
  const [endDate, setEndDate] = useState('');
  const reportRef = useRef<HTMLDivElement>(null);
  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    setEndDate(data.endDate.toString());
    setIsLoading(true);
    const reportData = await postData({
      url: `/reports/profit-or-loss`,
      data,
    });

    setReport(reportData);
    setIsLoading(false);
  };

  //   Calculate revenue
  const calcRevenue =
    report?.revenue?.reduce((acc, rev) => acc + rev.totalAmount, 0) ?? 0;
  //   Calculate cost
  const calcCost =
    report?.revenue?.reduce((acc, rev) => acc + rev.totalCost, 0) ?? 0;
  //   Calculate expenses
  const calcExpense =
    report?.expenses?.reduce((acc, exp) => acc + exp.totalAmount, 0) ?? 0;

  return (
    <AdminSection>
      <AdminHeader>
        <h4>profit & Loss Statement</h4>
        <Link to='/admin/account'>Account dashbaord</Link>
      </AdminHeader>
      {/* Report date selector form */}
      <form id='form' onSubmit={handleFormSubmit}>
        <div className='mt-3'>
          {report?.status === 'fail' && (
            <FormError info={report?.message || ''} />
          )}
        </div>
        <ThreeGrid>
          <AFormGroup className='mb-0'>
            <Label htmlFor='startDate' type='dark'>
              start date
            </Label>
            <Input type='date' id='startDate' name='startDate' $dark />
          </AFormGroup>
          <AFormGroup className='mb-0'>
            <Label htmlFor='endDate' type='dark'>
              end date
            </Label>
            <Input type='date' id='endDate' name='endDate' $dark />
          </AFormGroup>
          <AFormGroup className='btnWrapper mb-0'>
            <Button
              btnText={isLoading ? 'generating' : 'generate'}
              icon={<IoReloadCircleOutline />}
            />
          </AFormGroup>
        </ThreeGrid>
      </form>

      {report?.status === 'success' ? (
        <article>
          <div ref={reportRef}>
            <div className='admin-color text-center mt-3 mb-2 capitalize'>
              <h3 className='underline'>Metty general merchant</h3>
              <h4 className='underline'>
                Profit & loss as of {endDate && formatDate(new Date(endDate))}
              </h4>
            </div>
            {/* Income to gross profit */}
            <PandLWrapper>
              <PandLBox>
                <p>revenue</p>
                <p className='value'>
                  {calcRevenue ? formatNumber(calcRevenue) : '0.00'}
                </p>
              </PandLBox>
              <PandLBox>
                <p>cost of sales</p>
                <p className='value'>
                  {calcCost ? formatNumber(calcCost) : '0.00'}
                </p>
              </PandLBox>
              <PandLBox className='fw-500'>
                <p>gross profit</p>
                <p className='value'>
                  {calcRevenue && calcCost
                    ? formatNumber(calcRevenue - calcCost)
                    : '0.00'}
                </p>
              </PandLBox>
            </PandLWrapper>
            {/* Expenses */}
            <PandLWrapper>
              <h5 className='admin-color'>Expenses</h5>
              {/* Expenses listing */}
              {report?.expenses?.map((item) => (
                <PandLBox key={item._id}>
                  <p>{item._id}</p>
                  <p className='value'>
                    {item.totalAmount ? formatNumber(item.totalAmount) : '0'}
                  </p>
                </PandLBox>
              ))}

              {/* Total box */}
              <PandLBox className='fw-500'>
                <p>total expenses</p>
                <p className='value'>
                  {calcExpense ? formatNumber(calcExpense) : '0.00'}
                </p>
              </PandLBox>
            </PandLWrapper>
            <PandLWrapper>
              <PandLBox className='fw-500'>
                <p>profit/(loss)</p>
                <p className='value'>
                  {calcRevenue - calcCost - calcExpense === 0
                    ? '0.00'
                    : formatNumber(calcRevenue - calcCost - calcExpense)}
                </p>
              </PandLBox>
            </PandLWrapper>
          </div>
        </article>
      ) : (
        <Empty
          message='Select date range to generate report'
          showLink={false}
          type='dark'
        />
      )}
    </AdminSection>
  );
};

export default ProfitAndLoss;
