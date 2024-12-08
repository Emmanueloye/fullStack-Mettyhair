import styled, { css } from 'styled-components';

const DealCardWrapper = styled.article<{ type?: string }>`
  display: flex;
  background-color: var(--primary-color);
  border-top-left-radius: var(--border-radius-lg);
  border-bottom-left-radius: var(--border-radius-lg);

  .product-deals-text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: var(--primary-text-white);
    flex-basis: 60%;
    padding: 3rem 2rem;
    text-align: center;
    h4 {
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 2rem;
    }
    p {
      letter-spacing: 0.8px;
      width: 15rem;
      text-align: center;
      line-height: 1.2;
    }
  }
  .product-deals-img {
    flex-basis: 40%;
    min-height: 100%;
    img {
      width: 100%;
      height: 100%;
      object-fit: fill;
    }
  }

  ${(props) =>
    props.type === 'noImage' &&
    css`
      .product-deals-img {
        display: none;
        flex-basis: 100%;
      }
      .product-deals-text {
        flex-basis: 100%;
      }
    `}

  @media screen and (max-width: 400px) {
    .product-deals-img {
      display: none;
    }
    .product-deals-text {
      flex-basis: 100%;
    }
  }
`;

export default DealCardWrapper;
