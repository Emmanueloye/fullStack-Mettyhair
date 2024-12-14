/* eslint-disable react-refresh/only-export-components */
import { Header } from '../../features/authComponent/AuthStyles';
import CartProduct from '../../features/shoppingCart/CartProduct';
import Container from '../../ui/Container';
import styled from 'styled-components';
import ProductTotal from '../../features/shoppingCart/ProductTotal';
import Coupon from '../../features/shoppingCart/Coupon';
import Empty from '../../ui/Empty';
import { MdOutlineShoppingBag } from 'react-icons/md';
import { getData, queryClient } from '../../api/requests';
import { useQuery } from '@tanstack/react-query';
import { CartTypes } from '../../dtos/productsDto';
import HelmetSEO from '../../features/seo/HelmetSEO';

const CartWrapper = styled.section`
  padding-top: 5rem;

  .grid {
    display: grid;
    grid-template-columns: 1fr;
  }

  @media screen and (min-width: 1024px) {
    padding-top: 8rem;
    margin-bottom: 10rem;
    .grid {
      grid-template-columns: 2fr 1fr;
      gap: 3rem;
    }
  }
`;

const Cart = () => {
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
    <>
      <HelmetSEO
        title='Shopping cart'
        description='Shopping cart'
        name='Shopping cart'
        type='article'
        keyword='best hair vendor in lagos, affordable hairs, quality hair seller'
        // image={product.productImage}
      />
      <CartWrapper>
        <Container>
          <div className='grid'>
            <div>
              <Header $mb='1rem'>
                <h4>Shopping cart</h4>
              </Header>
              {carts?.length > 0 ? (
                carts.map((cart: CartTypes) => (
                  <CartProduct key={cart._id} cart={cart} />
                ))
              ) : (
                <Empty
                  icon={<MdOutlineShoppingBag />}
                  message='You cart is Empty.'
                  btnText='Continue shopping'
                  url='/'
                />
              )}
              {carts.length > 0 && <Coupon />}
            </div>
            {/* Update to receive data dynamically from the parent. */}
            {carts.length > 0 && (
              <ProductTotal showHeader={true} productTotal={productTotalCalc} />
            )}
          </div>
        </Container>
      </CartWrapper>
    </>
  );
};

export default Cart;

export const loader = async () => {
  await queryClient.ensureQueryData({
    queryKey: ['fetchCart', 'carts'],
    queryFn: () =>
      getData({
        url: `/carts?sort=-createdAt`,
        headers: { cartid: localStorage.getItem('xctid') as string },
      }),
  });

  return null;
};
