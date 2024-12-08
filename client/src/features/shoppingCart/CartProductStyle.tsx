import styled from 'styled-components';

const CartBox = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  background-color: var(--primary-white);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-rd);
  padding: 1rem;
  margin-bottom: 1rem;
  .product {
    display: flex;
    flex-direction: column;
    justify-items: center;
    align-items: center;
    gap: 1rem;
    img {
      border-radius: var(--border-radius-sm);
      margin-bottom: 1.5rem;
    }
    h4 {
      color: var(--main-red-500);
      font-size: 1.6rem;
      text-align: center;
      text-transform: capitalize;
    }
  }
  p {
    font-size: 1.2rem;
    text-align: center;

    span {
      text-transform: capitalize;
    }
  }
  .price {
    display: flex;
    flex-direction: column;
    margin-top: 2rem;
  }
  .price p {
    margin-top: 2rem;
  }
  .fade-price {
    text-decoration: line-through;
    opacity: 0.5;
  }
  .qty {
    margin: 3rem auto;
  }
  .delete {
    margin: 1.5rem auto;
    font-size: 2rem;
    color: var(--primary-color);
    cursor: pointer;
  }

  @media screen and (min-width: 680px) {
    grid-template-columns: 2fr 1fr 1fr 1fr 0.4fr;
    align-content: center;
    gap: 1rem;
    .product {
      flex-direction: row;
      img {
        margin-bottom: 0;
      }
      h4 {
        text-align: left;
      }
    }
    p {
      text-align: left;
    }
    .price {
      margin-top: 0;
    }
  }
  .price,
  .total,
  .delete {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .price p,
  .total p {
    font-size: 1.3rem;
    margin-top: 0;
  }
`;
export default CartBox;
