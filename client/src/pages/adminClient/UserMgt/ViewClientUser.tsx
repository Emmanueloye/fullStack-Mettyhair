import {
  Form,
  Link,
  LoaderFunctionArgs,
  useLoaderData,
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
import { getData, queryClient } from '../../../api/requests';
import { useQuery } from '@tanstack/react-query';
import { DEFAULT_USER_IMG } from '../../../utilities/constant';
import { formatDate } from '../../../utilities/HelperFunc';

const ViewClientUser = () => {
  const { id: userId } = useLoaderData() as { id: string };

  const {
    data: { user },
  } = useQuery({
    queryKey: ['singleUser', userId],
    queryFn: () => getData({ url: `/users/${userId}` }),
  });

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
              <Label htmlFor='restrict'>User App Access status</Label>
              <Input
                type='text'
                id='restrict'
                $dark={true}
                defaultValue={
                  user.token.at(0)?.isValid
                    ? 'Allow'
                    : 'Restrict/not logged in.'
                }
                disabled
                $capitalize={true}
              />
            </AFormGroup>

            <AFormGroup>
              <Label htmlFor='role'>User role</Label>
              <Input
                type='text'
                id='role'
                $dark={true}
                defaultValue={user.role}
                disabled
                $capitalize={true}
              />
            </AFormGroup>
          </TwoGrid>
        </Form>
      </TabContentWrapper>
    </AdminSection>
  );
};

export default ViewClientUser;

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id: userId } = params;
  await queryClient.ensureQueryData({
    queryKey: ['singleUser', userId],
    queryFn: () => getData({ url: `/users/${userId}` }),
  });
  return params;
};
