import styled from 'styled-components';

const Card = styled.article`
  background-color: var(--primary-white);
  border-radius: 10rem;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  transition: transform 0.3s ease-in-out;
  .card-header {
    img {
      width: 100%;
      height: 30rem;
      object-fit: fill;
      object-position: center;
      border-top-right-radius: 10rem;
      border-top-left-radius: 10rem;
    }
  }
  .card-body {
    padding: 1rem 2rem;
    h5 {
      color: var(--primary-color);
      text-align: center;
      text-transform: uppercase;
    }
    p {
      text-align: center;
      margin-top: 0.5rem;
      font-size: 1.4rem;
    }
    /* .pricing {
      display: flex;
      justify-content: space-between;
      margin-top: 1rem;
    }
    .single-price {
      justify-content: center;
    } */
    .pricing p:first-child {
      text-decoration: line-through;
      color: rgba(170, 68, 101, 0.5);
    }
    .pricing p:last-child {
      color: var(--primary-color);
      font-weight: 600;
    }
  }
  &:hover {
    transform: scale(1.02);
  }
`;
export default Card;
