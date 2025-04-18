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
} from '../../../features/adminNavLayouts/AdminUtils';
import Input, { Label } from '../../../ui/Input';
import Button from '../../../ui/Button';
import { FaSave } from 'react-icons/fa';
import { extractFormData, postData } from '../../../api/requests';
import FormError from '../../../ui/FormError';
import { InfoType } from '../../../dtos/utilsDto';

const NewExpenseHead = () => {
  const data = useActionData() as InfoType;

  return (
    <AdminSection>
      {data && <FormError info={data.message} />}
      {/* Header */}e
      <AdminHeader>
        <h4>new Expense Heads</h4>
        <Link to='/admin/account/expense-head'> Expense head</Link>
      </AdminHeader>
      <Form id='form' method='post'>
        <AFormGroup>
          <Label htmlFor='description' type='dark'>
            expense head description
          </Label>
          <Input type='text' id='description' $dark name='description' />
        </AFormGroup>

        <Button btnText='post' icon={<FaSave />} />
      </Form>
    </AdminSection>
  );
};

export default NewExpenseHead;

export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await extractFormData(request);
  return postData({
    url: '/expense-head',
    data,
    redirectTo: '/admin/account/expense-head',
    invalidate: ['fetchExpenseHead'],
  });
};
