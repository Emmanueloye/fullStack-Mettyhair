/* eslint-disable react-refresh/only-export-components */
import {
  Outlet,
  redirect,
  useLocation,
  useNavigate,
  useOutletContext,
} from 'react-router-dom';
import Container from '../../ui/Container';
import TabBtns from '../Tab/TabBtns';
import { useEffect } from 'react';
import { User } from '../../dtos/userDto';
import { getData, queryClient } from '../../api/requests';

const ProfileLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = useOutletContext<User>();

  // /user route does not exist. This switch the route for /user to /user/profile on mount.
  useEffect(() => {
    if (location.pathname === '/user') {
      navigate('/user/profile');
    }
  }, [location.pathname, navigate]);

  return (
    <div className='mt-5'>
      <Container>
        <TabBtns
          btnLabels={['profile', 'change password', 'order history']}
          type='link'
          prefix='user'
        />
        <div>
          <Outlet context={user} />
        </div>
      </Container>
    </div>
  );
};

export default ProfileLayout;

export const loader = async () => {
  const resp = await queryClient.ensureQueryData({
    queryKey: ['user'],
    queryFn: () => getData({ url: '/users/me' }),
  });
  if (resp.status === 'fail' || resp.status === 'error') {
    return redirect('/login');
  }
  return null;
};
