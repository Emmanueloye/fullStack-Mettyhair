import { useNavigate, useRouteError } from 'react-router-dom';
import AdminTopnav from '../../features/adminNavLayouts/AdminTopnav';
import Main, { AdminSection } from '../../features/adminNavLayouts/AdminUtils';
import Sidebar from '../../features/adminNavLayouts/Sidebar';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { useQuery } from '@tanstack/react-query';
import { customFetch, getOnlyData, queryClient } from '../../api/requests';
import { authActions } from '../../store/authAction';
import { toast } from 'react-toastify';
// import UserLoader from '../layouts/UserLoader';
import { TabContentWrapper } from '../../features/Tab/TabContentWrapper';
import styled from 'styled-components';
import { useEffect } from 'react';

const AdminErrorBox = styled.div`
  color: var(--admin-sec-text-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  h1,
  h3,
  h4 {
    margin-bottom: 2rem;
  }
  li {
    list-style: square;
    margin-top: 1rem;
  }
`;

const AdminError = () => {
  const { isAdminSidebarOpen } = useAppSelector((state) => state.adminUI);
  const { data } = useRouteError() as {
    data: { message: string; statusCode: number };
  };
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { data: userData } = useQuery({
    queryKey: ['user'],
    queryFn: () => getOnlyData({ url: '/users/me' }),
  });

  const logout = async () => {
    await customFetch.delete('/auth/logout');
    dispatch(authActions.updateAuthStatus(''));
    queryClient.invalidateQueries();
    toast.success('You are now logged out.');
    navigate('/');
  };

  const { user } = userData || {};

  useEffect(() => {
    if (user) {
      dispatch(authActions.updateAuthStatus(user));
    }
  }, [dispatch, user]);

  return (
    <>
      <Sidebar user={user} />
      <Main $isOpen={isAdminSidebarOpen}>
        <AdminTopnav user={user} onLogout={logout} />
        <AdminSection>
          <TabContentWrapper className='center' $dark>
            <AdminErrorBox>
              <h1 style={{ fontSize: '4rem' }}>👀</h1>
              <h3>
                {data?.message
                  ? data?.message
                  : 'The Page you are looking for does not exist.'}
              </h3>

              {data?.statusCode === 404 && (
                <>
                  <h4>Here are things you can do:</h4>
                  <ul
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <li>
                      <p>Check and ensure that the url is correct.</p>
                    </li>
                    <li>
                      <p>Check if you have permission.</p>
                    </li>
                    <li>
                      <p>Check your internet connection.</p>
                    </li>
                  </ul>
                </>
              )}
            </AdminErrorBox>
          </TabContentWrapper>
        </AdminSection>
      </Main>
    </>
  );
};

export default AdminError;
