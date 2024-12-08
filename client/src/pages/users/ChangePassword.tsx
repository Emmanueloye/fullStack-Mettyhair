import {
  ActionFunctionArgs,
  Form,
  redirect,
  useActionData,
  useNavigation,
} from 'react-router-dom';
import { TabContentWrapper } from '../../features/Tab/TabContentWrapper';
import { EditProfileWrapper, ProfileHeader } from './EditProfile';
import Button from '../../ui/Button';
import { GrDocumentUpdate } from 'react-icons/gr';
import InputGroup from '../../features/authComponent/InputGroup';
import { RiLockPasswordFill } from 'react-icons/ri';
import { customFetch, extractFormData, queryClient } from '../../api/requests';
import { toast } from 'react-toastify';
import axios from 'axios';
import FormError from '../../ui/FormError';
import { InfoType } from '../../dtos/utilsDto';

const ChangePassword = () => {
  const data = useActionData() as InfoType;
  const { state } = useNavigation();

  return (
    <EditProfileWrapper>
      <TabContentWrapper>
        <ProfileHeader>Update profile</ProfileHeader>
        <Form id='form' method='patch'>
          {data && <FormError info={data.message} />}

          <>
            <InputGroup
              type='password'
              name='oldPassword'
              placeholder='Current Password*'
              icon={<RiLockPasswordFill />}
              mb='2rem'
            />
            <InputGroup
              type='password'
              name='newPassword'
              placeholder='New Password*'
              icon={<RiLockPasswordFill />}
              mb='2rem'
            />
            <InputGroup
              type='password'
              name='confirmPassword'
              placeholder='Confirm Password*'
              icon={<RiLockPasswordFill />}
              mb='2rem'
            />

            <div className='mt-3'>
              <Button
                btnText={
                  state === 'submitting' ? 'Updating...' : 'Update Password'
                }
                icon={<GrDocumentUpdate />}
                disable={state === 'submitting'}
              />
            </div>
          </>
        </Form>
      </TabContentWrapper>
    </EditProfileWrapper>
  );
};

export default ChangePassword;

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
