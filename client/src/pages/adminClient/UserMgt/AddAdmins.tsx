import {
  ActionFunctionArgs,
  Form,
  json,
  useActionData,
  useNavigation,
  useOutletContext,
} from 'react-router-dom';
import {
  AdminHeader,
  AdminSection,
  AFormGroup,
  TwoGrid,
} from '../../../features/adminNavLayouts/AdminUtils';
import { TabContentWrapper } from '../../../features/Tab/TabContentWrapper';
import Input from '../../../ui/Input';
import { Select } from '../../../ui/SelectInput';
import Button from '../../../ui/Button';
import { MdCreateNewFolder } from 'react-icons/md';
import { useEffect, useState } from 'react';
import { extractFormData, postData } from '../../../api/requests';
import FormError from '../../../ui/FormError';
import { InfoType } from '../../../dtos/utilsDto';
import { User } from '../../../dtos/userDto';

const AddAdmins = () => {
  const [userRole, setUserRole] = useState('');
  const data = useActionData() as InfoType;
  const { state } = useNavigation();
  const user = useOutletContext() as User;

  useEffect(() => {
    if (!user.role.startsWith('super')) {
      throw json({ message: 'Page not found.' });
    }
  }, [user.role]);

  return (
    <AdminSection>
      <AdminHeader>
        <h4>Create Special User</h4>
        {/* <Link to='/admin/all-users'>all users</Link> */}
      </AdminHeader>
      <TabContentWrapper $dark={true}>
        <Form id='form' method='post'>
          {data && <FormError info={data.message} />}
          <>
            <TwoGrid>
              <AFormGroup>
                <Input
                  type='text'
                  placeholder='Full name*'
                  $dark={true}
                  name='fullName'
                  $capitalize={true}
                />
              </AFormGroup>

              <AFormGroup>
                <Input
                  type='email'
                  placeholder='Email*'
                  $dark={true}
                  name='email'
                />
              </AFormGroup>

              <AFormGroup>
                <Select
                  name='role'
                  id='role'
                  $bg='var(--admin-input-bg)'
                  $width='100%'
                  onChange={(e) => setUserRole(e.target.value)}
                >
                  <option value='' hidden>
                    Select user role*
                  </option>
                  <option value='super-admin'>super admin</option>
                  <option value='admin'>admin</option>
                </Select>
              </AFormGroup>
              {/* Subject to change */}
              {userRole === 'wholeseller' && (
                <AFormGroup>
                  <Select
                    name='customerType'
                    id='customerType'
                    $bg='var(--admin-input-bg)'
                    $width='100%'
                  >
                    <option value='' hidden>
                      Select customer type*
                    </option>
                    <option value='cash'>cash</option>
                    <option value='credit'>credit</option>
                  </Select>
                  <small
                    style={{
                      color: 'var(--main-red-600)',
                      fontWeight: '600',
                      marginTop: '1rem',
                    }}
                  >
                    Only application to wholesellers
                  </small>
                </AFormGroup>
              )}
            </TwoGrid>

            <Button
              btnText={state === 'submitting' ? 'Creating...' : 'Create user'}
              icon={<MdCreateNewFolder />}
              disable={state === 'submitting'}
            />
          </>
        </Form>
      </TabContentWrapper>
    </AdminSection>
  );
};

export default AddAdmins;

// eslint-disable-next-line react-refresh/only-export-components
export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await extractFormData(request);
  return postData({
    url: '/users/create-admin',
    data,
    redirectTo: '/admin/all-users',
    setToast: true,
    invalidate: ['users'],
  });
};
