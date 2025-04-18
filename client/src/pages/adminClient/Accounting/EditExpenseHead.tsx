/* eslint-disable react-refresh/only-export-components */
import {
  ActionFunctionArgs,
  Form,
  Link,
  LoaderFunctionArgs,
  useActionData,
  useLoaderData,
} from 'react-router-dom';
import {
  AdminHeader,
  AdminSection,
  AFormGroup,
} from '../../../features/adminNavLayouts/AdminUtils';
import Input, { Label } from '../../../ui/Input';
import Button from '../../../ui/Button';
import { FaSave } from 'react-icons/fa';
import {
  extractFormData,
  getData,
  queryClient,
  updateData,
} from '../../../api/requests';
import { useQuery } from '@tanstack/react-query';
import FormError from '../../../ui/FormError';
import { InfoType } from '../../../dtos/utilsDto';

const EditExpenseHead = () => {
  const params = useLoaderData() as { id: string };
  const actionData = useActionData() as InfoType;

  const { data } = useQuery({
    queryKey: ['fetchExpenseHead', 'expense-head', params.id],
    queryFn: () => getData({ url: `/expense-head/${params.id}` }),
  });

  return (
    <AdminSection>
      {actionData && <FormError info={actionData.message} />}
      {/* Header */}
      <AdminHeader>
        <h4>Update Expense Heads</h4>
        <Link to='/admin/account/expense-head'> Expense head</Link>
      </AdminHeader>
      <Form id='form' method='patch'>
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
          />
        </AFormGroup>

        <Button btnText='update' icon={<FaSave />} />
      </Form>
    </AdminSection>
  );
};

export default EditExpenseHead;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  await queryClient.ensureQueryData({
    queryKey: ['fetchExpenseHead', 'expense-head', params.id],
    queryFn: () => getData({ url: `/expense-head/${params.id}` }),
  });
  return params;
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const data = await extractFormData(request);
  return updateData({
    url: `/expense-head/${params.id}`,
    data,
    redirectTo: '/admin/account/expense-head',
    invalidate: ['fetchExpenseHead'],
  });
};
