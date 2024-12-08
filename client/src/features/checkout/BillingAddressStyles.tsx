import styled from 'styled-components';

const CheckoutInfoWrapper = styled.article<{ $dark?: boolean }>`
  background-color: ${(props) =>
    props.$dark ? 'var(--admin - alt - color)' : 'var(--primary-white)'};
  padding: 2rem 1rem;

  @media screen and (min-width: 1024px) {
    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 3rem;
    }
  }
`;

export default CheckoutInfoWrapper;
