/* eslint-disable react-refresh/only-export-components */
import styled from 'styled-components';
import { Header } from '../../features/authComponent/AuthStyles';
import Container from '../../ui/Container';
import { formatNumber } from '../../utilities/HelperFunc';
import {
  LoaderFunctionArgs,
  useLoaderData,
  useSearchParams,
} from 'react-router-dom';
import {
  extractParams,
  // getData,
  getOnlyData,
  queryClient,
} from '../../api/requests';
import { OrderType } from '../../dtos/orderDto';
import LinkBtn from '../../ui/LinkBtn';
import { Center } from '../../features/Tab/TabContentWrapper';

const Wrapper = styled.section`
  padding-top: 2rem;
  .details {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    background-color: var(--primary-white);
    padding: 1rem;
    border-bottom: 1px solid var(--main-red-300);
  }

  @media screen and (min-width: 736px) {
    width: 60%;
    margin: 8rem auto;
    .details {
    }
  }
`;

const PaymentConfirmation = () => {
  const { order } = useLoaderData() as { status: string; order: OrderType };
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference');

  return (
    <Wrapper>
      {order ? (
        <Container>
          <Header>
            <h4>Thanks for your patronage.</h4>
          </Header>
          <div className='p-details'>
            <div className='details'>
              <p>Status: </p>
              <p>Success</p>
            </div>
            <div className='details'>
              <p>Amount Paid: </p>
              <p>&#8358;{formatNumber(order.totalAmount)}</p>
            </div>
            <div className='details'>
              <p>Invoice numb: </p>
              <p>{order.invoiceNo}</p>
            </div>
            <div className='details'>
              <p>Reference: </p>
              <p>{order.reference}</p>
            </div>
          </div>
          <Center style={{ flexDirection: 'column', marginTop: '2rem' }}>
            <p>Please go to your order history for your order details.</p>
            <LinkBtn btnText='Order history' url='/user/order-history' />
          </Center>
        </Container>
      ) : (
        <Container>
          <Header>
            <h4>Thanks for your patronage.</h4>
          </Header>
          <div className='p-details'>
            <div className='details'>
              <p>Status: </p>
              <p>Success</p>
            </div>

            <div className='details'>
              <p>Reference: </p>
              <p>{reference}</p>
            </div>
          </div>
          <Center style={{ flexDirection: 'column', marginTop: '2rem' }}>
            <p>Please go to your order history for your order details.</p>
            <LinkBtn btnText='Order history' url='/user/order-history' />
          </Center>
        </Container>
      )}
    </Wrapper>
  );
};

export default PaymentConfirmation;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { reference } = extractParams(request);

  const resp = await getOnlyData({
    url: `/checkout/confirm-payment?reference=${reference}`,
  });

  queryClient.invalidateQueries({ queryKey: ['fetchOrder'] });
  queryClient.invalidateQueries({ queryKey: ['stats'] });

  return resp;
};
