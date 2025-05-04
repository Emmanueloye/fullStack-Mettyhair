import {
  Outlet,
  redirect,
  ScrollRestoration,
  useLoaderData,
  useNavigate,
  useNavigation,
} from 'react-router-dom';
import Sidebar from '../../features/adminNavLayouts/Sidebar';
import AdminTopnav from '../../features/adminNavLayouts/AdminTopnav';
import Main from '../../features/adminNavLayouts/AdminUtils';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { useQuery } from '@tanstack/react-query';
import { customFetch, getOnlyData, queryClient } from '../../api/requests';
import { useEffect } from 'react';
import { authActions } from '../../store/authAction';
import UserLoader from './UserLoader';
import { toast } from 'react-toastify';
import { User } from '../../dtos/userDto';

const AdminLayout = () => {
  const { isAdminSidebarOpen } = useAppSelector((state) => state.adminUI);

  const user = useLoaderData() as User;
  // console.log(x);

  const dispatch = useAppDispatch();
  const { state } = useNavigation();
  const navigate = useNavigate();

  // const { data } = useQuery({
  //   queryKey: ['user'],
  //   queryFn: () => getOnlyData({ url: '/users/me' }),
  // });
  const {
    data: { contacts },
  } = useQuery({
    queryKey: ['fetchContact', 'unreadMails'],
    queryFn: () => getOnlyData({ url: '/contacts?isRead=false' }),
  });

  const logout = async () => {
    await customFetch.delete('/auth/logout');
    dispatch(authActions.updateAuthStatus(''));
    queryClient.invalidateQueries();
    toast.success('You are now logged out.');
    navigate('/');
  };

  useEffect(() => {
    if (user) {
      dispatch(authActions.updateAuthStatus(user));
    }
    if (!user) {
      navigate('/');
    }
  }, [dispatch, navigate, user]);

  return (
    <>
      <Sidebar user={user} />
      <Main $isOpen={isAdminSidebarOpen}>
        <AdminTopnav user={user} onLogout={logout} unread={contacts?.length} />
        {state === 'loading' && <UserLoader />}
        {state === 'submitting' && <UserLoader />}
        <Outlet context={user} />
      </Main>
      <ScrollRestoration />
    </>
  );
};

export default AdminLayout;

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async () => {
  await queryClient.ensureQueryData({
    queryKey: ['fetchContact', 'unreadMails'],
    queryFn: () => getOnlyData({ url: '/contacts?isRead=false' }),
  });

  queryClient.invalidateQueries({ queryKey: ['user'] });
  const result = await getOnlyData({ url: '/users/me' });

  if (result.status === 'fail') {
    return redirect('/');
  }

  // console.log(result.user.role.split('-'));

  // const resp = await queryClient.ensureQueryData({
  //   queryKey: ['user'],
  //   queryFn: () => getOnlyData({ url: '/users/me' }),
  // });

  if (
    result.status === 'success' &&
    !result.user.role.split('-').includes('admin')
  ) {
    return redirect('/');
  }

  return result.user;
};
