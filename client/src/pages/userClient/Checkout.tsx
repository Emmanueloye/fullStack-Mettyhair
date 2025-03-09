/* eslint-disable react-refresh/only-export-components */
import styled from 'styled-components';
import { Header } from '../../features/authComponent/AuthStyles';
import BillingAddress from '../../features/checkout/BillingAddress';
import OrderSummary from '../../features/checkout/OrderSummary';
import ProductTotal from '../../features/shoppingCart/ProductTotal';
import Container from '../../ui/Container';
import {
  ActionFunctionArgs,
  Form,
  redirect,
  useActionData,
  useOutletContext,
} from 'react-router-dom';
import {
  extractFormData,
  getData,
  getOnlyData,
  postData,
  queryClient,
} from '../../api/requests';
import { CartTypes } from '../../dtos/productsDto';
import { useQuery } from '@tanstack/react-query';
import { User } from '../../dtos/userDto';
import { InfoType } from '../../dtos/utilsDto';

const SectionWrapper = styled.section`
  padding-top: 6rem;
  margin-bottom: 8rem;
  @media screen and (min-width: 1024px) {
    .grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 3rem;
    }
  }
`;

const Checkout = () => {
  const user = useOutletContext<User>();
  const error = useActionData() as InfoType;

  const {
    data: { carts },
  } = useQuery({
    queryKey: ['fetchCart', 'carts'],
    queryFn: () =>
      getData({
        url: `/carts?sort=-createdAt`,
        headers: { cartid: localStorage.getItem('xctid') as string },
      }),
  });

  const {
    data: { countries },
  } = useQuery({
    queryKey: ['countries'],
    queryFn: () => getOnlyData({ url: '/locations/countries?sort=country' }),
  });

  // Calculate cart subtotal and total discount from the user cart item.s
  const productTotalCalc = carts.reduce(
    (acc: { subtotal: number; totalDiscount: number }, cart: CartTypes) => {
      // Calculate discount price per unit.
      const discountPerUnit = cart.product.discountPrice
        ? cart.product.sellingPrice - cart.product.discountPrice
        : 0;

      // Calculate subtotal using selling price.
      const subtotal = (acc.subtotal +=
        cart.product.sellingPrice * cart.quantity);

      // Calculate subtotal using selling price.
      const totalDiscount = (acc.totalDiscount +=
        discountPerUnit * cart.quantity);

      return { subtotal, totalDiscount };
    },
    { subtotal: 0, totalDiscount: 0 }
  );

  return (
    <SectionWrapper>
      <Form method='post'>
        <Container>
          <div className='grid'>
            <BillingAddress user={user} error={error} countries={countries} />

            <div className='box'>
              <Header $mb='1rem'>
                <h4>your order</h4>
              </Header>
              {carts.map((cart: CartTypes) => (
                <OrderSummary cart={cart} key={cart._id} />
              ))}

              {/* Update the data from the parent */}
              <ProductTotal
                productTotal={productTotalCalc}
                showHeader={false}
                marginTop='0'
                btnType='btn'
              />
            </div>
          </div>
        </Container>
      </Form>
    </SectionWrapper>
  );
};

export default Checkout;

// Loader
export const loader = async () => {
  const cartsResp = await queryClient.ensureQueryData({
    queryKey: ['fetchCart', 'carts'],
    queryFn: () =>
      getData({
        url: `/carts?sort=-createdAt`,
        headers: { cartid: localStorage.getItem('xctid') as string },
      }),
  });

  await queryClient.ensureQueryData({
    queryKey: ['countries'],
    queryFn: () => getOnlyData({ url: '/locations/countries?sort=country' }),
  });

  const userResp = await queryClient.ensureQueryData({
    queryKey: ['user'],
    queryFn: () => getData({ url: `/users/me` }),
  });

  // Redirect the user to home page if trying to access checkout route with no item in cart.
  if (cartsResp.carts.length <= 0) return redirect('/');

  // Redirect to login if user tries to access checkout without logging in.
  if (!userResp.user) return redirect('/login');

  return null;
};

// Action
export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await extractFormData(request);
  console.log(data);

  const resp = await postData({ url: `/checkout`, data });
  if (resp.status === 'success') {
    return redirect(resp.checkout.authorization_url);
  }

  return resp;
};
