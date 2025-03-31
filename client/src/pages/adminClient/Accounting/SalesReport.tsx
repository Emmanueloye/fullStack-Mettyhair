/* eslint-disable react-refresh/only-export-components */
import { useSearchParams } from 'react-router-dom';
import {
  AdminSection,
  AFormGroup,
  ThreeGrid,
} from '../../../features/adminNavLayouts/AdminUtils';
import Input, { Label } from '../../../ui/Input';
import Button from '../../../ui/Button';
import { IoReloadCircleOutline } from 'react-icons/io5';
import { OrderLabel } from '../../../features/adminAccount/adminOrderStyles';
import { StatementBox } from '../../../features/products/ClientStatementStyles';
import { SalesReportType } from '../../../dtos/salesReportDto';
import React, { useState } from 'react';
import { formatNumber } from '../../../utilities/HelperFunc';
import FormError from '../../../ui/FormError';
import ReportPagination from '../../../ui/ReportPagination';
import { PAGE_SIZE } from '../../../utilities/constant';
import Empty from '../../../ui/Empty';
import { getOnlyData } from '../../../api/requests';

const SalesReport = () => {
  const [report, setReport] = useState<{
    status: string;
    noHits?: number;
    message?: string;
    salesReport: SalesReportType[];
  }>();
  const [isLoading, setIsLoading] = useState(false);

  // Get sales report based on the report dates submitted.
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    setIsLoading(true);
    const reportData = await getOnlyData({
      url: `/reports/sales?startDate=${data.startDate}&endDate=${data.endDate}`,
    });
    setReport(reportData);
    setIsLoading(false);
  };

  const [searchParams] = useSearchParams();
  // Get current page from search params.
  const currentPage = !searchParams.get('page')
    ? 1
    : Number(searchParams.get('page'));
  // Set start and end index for slice
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = currentPage * PAGE_SIZE;

  // Get and slice the sales report data based on the start and end index.
  const salesReportData = report?.salesReport || [];
  const paginatedReport = salesReportData?.slice(startIndex, endIndex);
  return (
    <AdminSection>
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
              btnText={`${isLoading ? 'generating' : 'generate'}`}
              icon={<IoReloadCircleOutline />}
            />
          </AFormGroup>
        </ThreeGrid>
      </form>

      {salesReportData?.length > 0 ? (
        <StatementBox id='statement'>
          <div className='box bg-white'>
            <div className='grid accessmgr-group fw-500'>
              <OrderLabel className='color'>customer</OrderLabel>
              <OrderLabel className='color'>products</OrderLabel>
              <OrderLabel className='color'>quantity</OrderLabel>
              <OrderLabel className='color'>price</OrderLabel>
              <OrderLabel className='color'>amount</OrderLabel>
            </div>
            <div>
              {paginatedReport?.map((item) => {
                return (
                  <React.Fragment key={item._id}>
                    <div className='grid border-bottom font-bold'>
                      <p className='capitalize'>{item._id}</p>
                      <p></p>
                      <p className='capitalize'>
                        {formatNumber(item.totalQuantity)}
                      </p>
                      <p></p>
                      <p className='capitalize'>
                        {formatNumber(item.totalOrderAmount)}
                      </p>
                    </div>
                    {item.orderItems.map((item) => (
                      <div key={item._id} className={`grid lines capitalize `}>
                        <p>SO-{item.orderNo}</p>
                        <p>{item.productName}</p>
                        <p>{formatNumber(item.quantity)}</p>
                        <p>{formatNumber(item.price)}</p>
                        <p>{formatNumber(item.quantity * item.price)}</p>
                      </div>
                    ))}
                  </React.Fragment>
                );
              })}
            </div>
            <ReportPagination
              numbOfResults={report?.salesReport?.length || 1}
            />
          </div>
        </StatementBox>
      ) : (
        <Empty
          message='No sales available for the date range selected'
          showLink={false}
        />
      )}
    </AdminSection>
  );
};

export default SalesReport;
