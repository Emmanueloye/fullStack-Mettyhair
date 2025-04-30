/* eslint-disable react-refresh/only-export-components */
import Container from '../../ui/Container';
import TabBtns from '../Tab/TabBtns';
import { Outlet, redirect, useOutletContext } from 'react-router-dom';
import { getData, queryClient } from '../../api/requests';
import { User } from '../../dtos/userDto';
import { Helmet } from 'react-helmet-async';

const WholeSellerOrderLayout = () => {
  const user = useOutletContext<User>();
  return (
    <>
      <Helmet>
        <title>MettyHair - Wholesaler Dashboard</title>
      </Helmet>
      <div className='mt-5'>
        <Container>
          <TabBtns
            btnLabels={['open orders', 'invoiced orders', 'statement']}
            type='link'
            prefix='my-dashboard'
          />
          <div>
            <Outlet context={user} />
          </div>
        </Container>
      </div>
    </>
  );
};

export default WholeSellerOrderLayout;

export const loader = async () => {
  const resp = await queryClient.ensureQueryData({
    queryKey: ['user'],
    queryFn: () => getData({ url: '/users/me' }),
  });

  if (
    resp.status === 'fail' ||
    resp.status === 'error' ||
    resp.user.role !== 'wholesaler'
  ) {
    return redirect('/login');
  }
  return null;
};
