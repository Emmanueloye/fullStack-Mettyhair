import {
  Outlet,
  ScrollRestoration,
  useNavigate,
  useNavigation,
} from 'react-router-dom';
import MainNav from '../../features/navigationbar/MainNav';
import TopNav from '../../features/navigationbar/TopNav';
import Footer from '../../features/footer/Footer';
import { useAppDispatch } from '../../store/hook';
import { uiActions } from '../../store/uiSlice';
import UserLoader from './UserLoader';
import { customFetch, getOnlyData, queryClient } from '../../api/requests';
import { useEffect } from 'react';
import { authActions } from '../../store/authAction';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
// import { AxiosError } from 'axios';

const UserClientLayout = () => {
  const dispatch = useAppDispatch();
  const { state } = useNavigation();
  const navigate = useNavigate();

  const {
    data: { user },
  } = useQuery({
    queryKey: ['user'],
    queryFn: () => getOnlyData({ url: '/users/me' }),
  });

  const {
    data: { categories },
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getOnlyData({ url: `/categories?sort=createdAt` }),
  });

  const {
    data: { subcategories },
  } = useQuery({
    queryKey: ['subcategories'],
    queryFn: () =>
      getOnlyData({ url: `/subcategories?sort=createdAt&isActive=true` }),
  });

  const {
    data: { carts },
  } = useQuery({
    queryKey: ['fetchCart', 'carts'],
    queryFn: () =>
      getOnlyData({
        url: `/carts?sort=-createdAt`,
        headers: { cartid: localStorage.getItem('xctid') as string },
      }),
  });

  const {
    data: { settings },
  } = useQuery({
    queryKey: ['setting'],
    queryFn: () =>
      getOnlyData({
        url: `/settings`,
      }),
  });

  const logout = async () => {
    await customFetch.delete('/auth/logout');
    dispatch(authActions.updateAuthStatus(''));
    queryClient.invalidateQueries();
    navigate('/');
    toast.success('You are now logged out.');
  };

  useEffect(() => {
    if (user) {
      dispatch(authActions.updateAuthStatus(user));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (user) {
      localStorage.removeItem('xctid');
      queryClient.invalidateQueries({ queryKey: ['fetchCart'] });
    }
  }, [user]);

  return (
    <>
      <header className='header'>
        <TopNav user={user} onLogout={logout} setting={settings?.at(0)} />
        <MainNav
          user={user}
          categories={categories}
          subcategories={subcategories}
          carts={carts}
        />
      </header>
      <main
        className='main'
        onMouseEnter={() => dispatch(uiActions.closeSubmenu())}
      >
        {state === 'loading' && <UserLoader />}
        {state === 'submitting' && <UserLoader />}
        <Outlet context={user} />
      </main>
      <Footer setting={settings?.at(0)} />
      <ScrollRestoration />
    </>
  );
};

export default UserClientLayout;

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async () => {
  const user = queryClient.ensureQueryData({
    queryKey: ['user'],
    queryFn: () => getOnlyData({ url: '/users/me' }),
  });

  const categories = await queryClient.ensureQueryData({
    queryKey: ['categories'],
    queryFn: () => getOnlyData({ url: `/categories?sort=createdAt` }),
  });

  const subcategories = await queryClient.ensureQueryData({
    queryKey: ['subcategories'],
    queryFn: () =>
      getOnlyData({ url: `/subcategories?sort=createdAt&isActive=true` }),
  });

  const carts = await queryClient.ensureQueryData({
    queryKey: ['fetchCart', 'carts'],
    queryFn: () =>
      getOnlyData({
        url: `/carts?sort=-createdAt`,
        headers: { cartid: localStorage.getItem('xctid') as string },
      }),
  });

  await queryClient.ensureQueryData({
    queryKey: ['setting'],
    queryFn: () =>
      getOnlyData({
        url: `/settings`,
      }),
  });

  return { user, categories, subcategories, carts };
};
