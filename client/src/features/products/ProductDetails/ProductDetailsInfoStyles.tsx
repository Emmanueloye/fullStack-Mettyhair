import styled from 'styled-components';

const ProductInfoWrapper = styled.article`
  .pname {
    margin-bottom: 2rem;
    text-transform: capitalize;
  }
  .pricing {
    display: flex;
    flex-wrap: wrap;
    gap: 3rem;
    font-size: 1.6rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    .sprice {
      color: var(--primary-color);
      font-weight: 600;
    }
    .dprice {
      color: var(--primary-color);
      text-decoration: line-through;
      opacity: 0.7;
    }
  }
  .status {
    font-weight: 600;
    margin-top: 2rem;
  }
  .stockout {
    color: red;
  }
  .available {
    color: green;
  }
  .action {
    display: flex;
    justify-content: center;
    align-items: space-between;
    flex-direction: column;
    flex-wrap: wrap;
    margin-top: 3rem;

    .options {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 3rem;
    }
    .input {
      border: none;
      font-size: 1.4rem;
      padding: 1rem 0;
      text-align: center;
      outline: none;
      height: 4.4rem;
      margin-left: 1rem;
    }
  }

  @media screen and (min-width: 779px) {
    .options {
      margin-top: 3rem;
    }
    .btn {
      margin-top: 4rem;
    }
  }

  @media screen and (max-width: 490px) {
    .action {
      flex-direction: column;
      .btn {
        margin-top: 2rem;
      }
    }
  }
`;
export default ProductInfoWrapper;
