import { useNavigate, useRouteError } from 'react-router-dom';
import Footer from '../../features/footer/Footer';
import MainNav from '../../features/navigationbar/MainNav';
import TopNav from '../../features/navigationbar/TopNav';
import { TabContentWrapper } from '../../features/Tab/TabContentWrapper';
import Container from '../../ui/Container';
import LinkBtn from '../../ui/LinkBtn';
import { customFetch, getOnlyData, queryClient } from '../../api/requests';
import { useAppDispatch } from '../../store/hook';
import { authActions } from '../../store/authAction';
import { toast } from 'react-toastify';
import UserLoader from '../layouts/UserLoader';
import { uiActions } from '../../store/uiSlice';
import { useEffect, useState } from 'react';
import { User } from '../../dtos/userDto';
import { CategoriesType, SubcategoriesType } from '../../dtos/categoriesDto';
import { CartTypes } from '../../dtos/productsDto';
import { SettingTypes } from '../../dtos/settingDto';

const UserError = () => {
  const { data } = useRouteError() as {
    data: { message: string; statusCode: number };
  };
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User>();
  const [categories, setCategories] = useState<CategoriesType[]>([]);
  const [subcategories, setSubcategories] = useState<SubcategoriesType[]>([]);
  const [carts, setCarts] = useState<CartTypes[]>([]);
  const [setting, setSetting] = useState<SettingTypes | undefined>();

  const fetchData = async () => {
    setIsLoading(true);
    const resp = await Promise.all([
      getOnlyData({ url: '/users/me' }),
      getOnlyData({ url: `/categories?sort=createdAt` }),
      getOnlyData({ url: `/subcategories?sort=createdAt&isActive=true` }),
      getOnlyData({
        url: `/carts?sort=-createdAt`,
        headers: { cartid: localStorage.getItem('xctid') as string },
      }),
      getOnlyData({ url: '/settings' }),
    ]);
    const [
      { user },
      { categories },
      { subcategories },
      { carts },
      { settings },
    ] = resp;
    setUser(user);
    setCategories(categories);
    setSubcategories(subcategories);
    setCarts(carts);
    setSetting(settings?.[0]);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

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
  }, [dispatch, user]);

  return (
    <>
      {isLoading ? (
        <UserLoader />
      ) : (
        <>
          <header>
            <TopNav user={user!} onLogout={logout} setting={setting} />
            <MainNav
              user={user!}
              categories={categories!}
              subcategories={subcategories!}
              carts={carts!}
            />
          </header>
          <main
            className='main error'
            onMouseEnter={() => dispatch(uiActions.closeSubmenu())}
          >
            <Container>
              <TabContentWrapper className='center'>
                <h1>👀</h1>
                <h3>
                  {data?.message
                    ? data?.message
                    : 'The Page you are looking for does not exist.'}
                </h3>

                {data?.statusCode === 404 && (
                  <>
                    <h4>Here are things you can do:</h4>
                    <ul>
                      <li>Check and ensure that the url is correct.</li>
                      <li>Check your internet connection.</li>
                    </ul>
                  </>
                )}

                <LinkBtn btnText='continue shopping' url='/' />
              </TabContentWrapper>
            </Container>
          </main>
          <Footer setting={setting} />
        </>
      )}
    </>
  );
};

export default UserError;
