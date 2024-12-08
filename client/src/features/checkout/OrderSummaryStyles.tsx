import styled from 'styled-components';

const OrderSummaryWrapper = styled.article<{ $dark?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) =>
    props.$dark ? 'var(--admin-white)' : 'var(--primary-white)'};
  border-bottom: 2px solid var(--main-red-200);
  color: ${(props) => (props.$dark ? 'var(--admin-sec-text-color)' : '')};
  padding: 1rem;
  .order {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }
  h5 {
    color: var(--main-red-300);
    text-transform: capitalize;
  }
  .mt-0 {
    margin-top: 0;
  }
  p {
    font-size: 1.3rem;
  }
  .img-box {
    background-color: var(--primary-white);
    img {
      border-radius: var(--border-radius-lg);
    }
  }
  @media screen and (max-width: 240px) {
    flex-direction: column;
    justify-content: center;
    text-align: center;

    img {
      display: none;
    }
  }
`;

export default OrderSummaryWrapper;
