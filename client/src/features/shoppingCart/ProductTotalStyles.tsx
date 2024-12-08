import styled from 'styled-components';

const TotalWrapper = styled.div<{ $mt?: string; $dark?: boolean }>`
  margin-top: ${(props) => (props.$mt ? props.$mt : '4rem')};
  margin-bottom: 3rem;
  .box {
    background-color: ${(props) =>
      props.$dark ? 'var(--admin-white)' : 'var(--primary-white)'};
    box-shadow: var(--shadow-rd);
    color: ${(props) => (props.$dark ? 'var(--admin-sec-text-color)' : '')};
  }
  .cost-breakdown {
    padding: 1rem;
  }
  .subtotal {
    display: flex;
    justify-content: space-between;
    text-transform: capitalize;
    padding-top: 1rem;
    padding-bottom: 1rem;
    p {
      font-size: 1.4rem;
    }
    p:first-child {
      color: var(--main-red-300);
      font-weight: 600;
      text-transform: uppercase;
    }
  }
  .border {
    border-bottom: 1px solid var(--main-red-200);
  }
  .border-tick {
    border-bottom: 2px double var(--main-red-200);
  }
  .footer {
    padding: 1rem;
  }
  .total {
    font-weight: 600;
  }

  @media screen and (min-width: 1024px) {
    margin-top: 0;
  }
  @media screen and (max-width: 240px) {
    .subtotal {
      flex-direction: column;
      align-items: center;
    }
  }
`;
export default TotalWrapper;
