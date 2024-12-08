import {
  ActionFunctionArgs,
  Form,
  redirect,
  useActionData,
  useNavigation,
} from 'react-router-dom';
import {
  AdminHeader,
  AdminSection,
  AFormGroup,
} from '../../features/adminNavLayouts/AdminUtils';
import { TabContentWrapper } from '../../features/Tab/TabContentWrapper';
import Input from '../../ui/Input';
import Button from '../../ui/Button';
import { GrDocumentUpdate } from 'react-icons/gr';
import { customFetch, extractFormData, queryClient } from '../../api/requests';
import { toast } from 'react-toastify';
import axios from 'axios';
import { InfoType } from '../../dtos/utilsDto';
import FormError from '../../ui/FormError';

const AdminPasswordChange = () => {
  const data = useActionData() as InfoType;
  const { state } = useNavigation();
  return (
    <AdminSection>
      <AdminHeader>
        <h4>Update password</h4>
      </AdminHeader>
      <TabContentWrapper $dark={true}>
        <Form id='form' method='post'>
          {data && <FormError info={data.message} />}
          <>
            <AFormGroup>
              <Input
                type='password'
                placeholder='Current password*'
                name='oldPassword'
                $dark={true}
              />
            </AFormGroup>
            <AFormGroup>
              <Input
                type='password'
                placeholder='New password*'
                name='newPassword'
                $dark={true}
              />
            </AFormGroup>
            <AFormGroup>
              <Input
                type='password'
                placeholder='Confirm password*'
                name='confirmPassword'
                $dark={true}
              />
            </AFormGroup>
            <AFormGroup>
              <Button
                btnText={
                  state === 'submitting' ? 'Updating...' : 'Update Password'
                }
                icon={<GrDocumentUpdate />}
                disable={state === 'submitting'}
              />
            </AFormGroup>
          </>
        </Form>
      </TabContentWrapper>
    </AdminSection>
  );
};

export default AdminPasswordChange;

// eslint-disable-next-line react-refresh/only-export-components
export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await extractFormData(request);
  try {
    const resp = await customFetch.patch('/users/update-password', data);
    queryClient.invalidateQueries();
    toast.success(resp.data.message);
    return redirect('/login');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    }
  }
};
