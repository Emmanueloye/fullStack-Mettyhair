/* eslint-disable react-refresh/only-export-components */
import { Link, LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
import {
  AdminHeader,
  AdminSection,
  AFormGroup,
} from '../../../features/adminNavLayouts/AdminUtils';
import Input, { Label } from '../../../ui/Input';
import { getData, queryClient } from '../../../api/requests';
import { useQuery } from '@tanstack/react-query';
import { formatDate } from '../../../utilities/HelperFunc';

const ViewExpenseHead = () => {
  const params = useLoaderData() as { id: string };

  const { data } = useQuery({
    queryKey: ['fetchExpenseHead', 'expense-head', params.id],
    queryFn: () => getData({ url: `/expense-head/${params.id}` }),
  });

  return (
    <AdminSection>
      {/* Header */}
      <AdminHeader>
        <h4>View Expense Head</h4>
        <Link to='/admin/account/expense-head'> Expense head</Link>
      </AdminHeader>
      <AFormGroup>
        <Label htmlFor='description' type='dark'>
          expense head description
        </Label>
        <Input
          type='text'
          id='description'
          $dark
          name='description'
          defaultValue={data.expenseHead.description}
          disabled
          $capitalize
        />
      </AFormGroup>
      <AFormGroup>
        <Label htmlFor='createdAt' type='dark'>
          Created date
        </Label>
        <Input
          type='text'
          id='createdAt'
          $dark
          name='createdAt'
          defaultValue={formatDate(new Date(data.expenseHead.createdAt))}
          disabled
          $capitalize
        />
      </AFormGroup>
      <AFormGroup>
        <Label htmlFor='createdBy' type='dark'>
          Created date
        </Label>
        <Input
          type='text'
          id='createdBy'
          $dark
          name='createdBy'
          defaultValue={data.expenseHead.createdBy.fullName}
          disabled
          $capitalize
        />
      </AFormGroup>

      <AFormGroup>
        <Label htmlFor='updatedAt' type='dark'>
          updated date
        </Label>
        <Input
          type='text'
          id='updatedAt'
          $dark
          name='updatedAt'
          defaultValue={
            data.expenseHead.updatedAt &&
            formatDate(new Date(data.expenseHead.updatedAt))
          }
          disabled
          $capitalize
        />
      </AFormGroup>

      <AFormGroup>
        <Label htmlFor='updatedBy' type='dark'>
          updated by
        </Label>
        <Input
          type='text'
          id='updatedBy'
          $dark
          name='updatedBy'
          defaultValue={data.expenseHead?.updatedBy?.fullName}
          disabled
          $capitalize
        />
      </AFormGroup>
    </AdminSection>
  );
};

export default ViewExpenseHead;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  await queryClient.ensureQueryData({
    queryKey: ['fetchExpenseHead', 'expense-head', params.id],
    queryFn: () => getData({ url: `/expense-head/${params.id}` }),
  });
  return params;
};
