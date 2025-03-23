import {
  Form,
  Link,
  LoaderFunctionArgs,
  useLoaderData,
  useNavigate,
} from 'react-router-dom';
import {
  AdminHeader,
  AdminSection,
  AFormGroup,
  TwoGrid,
} from '../../../features/adminNavLayouts/AdminUtils';
import {
  Center,
  TabContentWrapper,
} from '../../../features/Tab/TabContentWrapper';
import Input, { Label } from '../../../ui/Input';
import { Select } from '../../../ui/SelectInput';
import { getData, queryClient, updateData } from '../../../api/requests';
import { useQuery } from '@tanstack/react-query';
import { DEFAULT_USER_IMG } from '../../../utilities/constant';
import { formatDate, slugifyText } from '../../../utilities/HelperFunc';
import { toast } from 'react-toastify';
import { useState } from 'react';

const EditUser = () => {
  const { id: userId } = useLoaderData() as { id: string };
  const [isLoading, setIsLoading] = useState(false);
  const [isRoleLoading, setIsRoleLoading] = useState(false);

  const navigate = useNavigate();

  const usersRole = ['super admin', 'admin', 'user', 'wholeseller'];

  const {
    data: { user },
  } = useQuery({
    queryKey: ['singleUser', userId],
    queryFn: () => getData({ url: `/users/${userId}` }),
  });

  console.log(user);

  const handleUserAccess = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      setIsLoading(true);
      const data = { restrict: e.target.value };
      const resp = await updateData({ url: `/users/restrict/${userId}`, data });

      queryClient.invalidateQueries({ queryKey: ['singleUser'] });
      toast.success(resp?.message);
      navigate('/admin/all-users');
      setIsLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error?.message);
    }
  };

  const handleUserRole = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      setIsRoleLoading(true);
      const data = { role: e.target.value };
      const resp = await updateData({
        url: `/users/role/${userId}`,
        data,
      });

      queryClient.invalidateQueries({ queryKey: ['singleUser'] });
      toast.success(resp?.message);
      navigate('/admin/all-users');
      setIsRoleLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setIsRoleLoading(false);
      toast.error(error?.message);
    }
  };

  return (
    <AdminSection>
      <AdminHeader>
        <h4>Update User</h4>
        <Link to='/admin/all-users'>all users</Link>
      </AdminHeader>
      <TabContentWrapper $dark={true}>
        <Center>
          <img
            src={user.photo || DEFAULT_USER_IMG}
            alt='user image'
            width={80}
            height={80}
            className='rounded-img'
            style={{
              border: '2px solid var(--main-red-600)',
              padding: '.5rem',
            }}
          />
        </Center>
        <Form id='form'>
          <TwoGrid>
            <AFormGroup>
              <Label htmlFor='fullName'>Full name</Label>
              <Input
                type='text'
                id='fullName'
                $dark={true}
                defaultValue={user.fullName}
                disabled
                $capitalize={true}
              />
            </AFormGroup>
            <AFormGroup>
              <Label htmlFor='email'>email</Label>
              <Input
                type='text'
                id='email'
                $dark={true}
                defaultValue={user.email}
                disabled
              />
            </AFormGroup>
            <AFormGroup>
              <Label htmlFor='startDate'>start Date</Label>
              <Input
                type='text'
                id='startDate'
                $dark={true}
                defaultValue={
                  user.createdAt && formatDate(new Date(user.createdAt))
                }
                disabled
                $capitalize={true}
              />
            </AFormGroup>
            <AFormGroup>
              <Label htmlFor='status'>status</Label>
              <Input
                type='text'
                id='status'
                $dark={true}
                defaultValue={user.token.at(0)?.isValid ? 'online' : 'offline'}
                disabled
                $capitalize={true}
              />
            </AFormGroup>

            <AFormGroup>
              <Label htmlFor='restrict'>
                User App Access status {isLoading && '(Sending...)'}
              </Label>
              <Select
                name='restrict'
                id='restrict'
                $bg='var(--admin-input-bg)'
                $width='100%'
                onChange={handleUserAccess}
              >
                {user.token.length === 0 && (
                  <option value=''>Not Logged in</option>
                )}
                {user.token.at(0)?.isValid ? (
                  <>
                    <option value='true'>Allow</option>
                    <option value='false'>Restrict</option>
                  </>
                ) : (
                  <>
                    <option value='false'>Restrict</option>
                    <option value='true'>Allow</option>
                  </>
                )}
              </Select>
            </AFormGroup>

            <AFormGroup>
              <Label htmlFor='role'>
                User role {isRoleLoading && '(Sending...)'}
              </Label>
              <Select
                name='role'
                id='role'
                $bg='var(--admin-input-bg)'
                $width='100%'
                onChange={handleUserRole}
              >
                <option value={slugifyText(user.role)}>{user.role}</option>
                {usersRole
                  .filter((el) => slugifyText(el) !== user.role)
                  .map((role, index) => (
                    <option value={slugifyText(role)} key={index}>
                      {role}
                    </option>
                  ))}
              </Select>
            </AFormGroup>
          </TwoGrid>
        </Form>
      </TabContentWrapper>
    </AdminSection>
  );
};

export default EditUser;

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id: userId } = params;
  await queryClient.ensureQueryData({
    queryKey: ['singleUser', userId],
    queryFn: () => getData({ url: `/users/${userId}` }),
  });
  return params;
};
