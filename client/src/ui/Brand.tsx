import styled from 'styled-components';

const BrandText = styled.h4`
  color: var(--secondary-text-white);
  font-weight: 900;
  letter-spacing: 0.1rem;
  span {
    font-style: italic;
  }
`;

export const BrandLink = styled.div`
  a {
    color: var(--admin-text-color);
    font-size: 2rem;
    font-weight: 900;
    letter-spacing: 0.1rem;
    span {
      font-style: italic;
    }
  }
`;

export default BrandText;
