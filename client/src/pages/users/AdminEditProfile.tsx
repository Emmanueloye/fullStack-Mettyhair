import {
  ActionFunctionArgs,
  Form,
  useNavigation,
  useOutletContext,
} from 'react-router-dom';
import {
  AdminHeader,
  AdminSection,
  AFormGroup,
} from '../../features/adminNavLayouts/AdminUtils';
import { TabContentWrapper } from '../../features/Tab/TabContentWrapper';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import { GrDocumentUpdate } from 'react-icons/gr';
import { updateData } from '../../api/requests';
import { User } from '../../dtos/userDto';

const AdminEditProfile = () => {
  const user = useOutletContext<User>();
  const { state } = useNavigation();
  return (
    <AdminSection>
      <AdminHeader>
        <h4>Update profile</h4>
      </AdminHeader>
      <TabContentWrapper $dark={true}>
        <Form id='form' method='patch' encType='multipart/form-data'>
          <AFormGroup>
            <Input
              type='text'
              name='fullName'
              placeholder='Full name*'
              defaultValue={user.fullName}
              $dark={true}
              $capitalize={true}
            />
          </AFormGroup>
          <AFormGroup>
            <Input
              type='email'
              name='email'
              placeholder='Email*'
              defaultValue={user.email}
              $dark={true}
            />
          </AFormGroup>

          <AFormGroup>
            <Input type='file' name='photo' $dark={true} />
          </AFormGroup>

          <AFormGroup>
            <Button
              btnText={
                state === 'submitting' ? 'Updating...' : 'Update profile'
              }
              icon={<GrDocumentUpdate />}
            />
          </AFormGroup>
        </Form>
      </TabContentWrapper>
    </AdminSection>
  );
};

export default AdminEditProfile;

// eslint-disable-next-line react-refresh/only-export-components
export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await request.formData();
  return updateData({
    url: '/users/me',
    data,
    redirectTo: '/admin/profile',
    setToast: true,
    invalidate: ['user'],
  });
};
