import styled from 'styled-components';

const InvoiceWrapper = styled.div`
  img {
    display: initial;
  }
  .invoice-header {
    background-color: var(--primary-white);
    padding: 2rem;
  }
  h2 {
    color: var(--primary-color);
    text-align: center;
    span {
      font-size: 1.2rem;
      color: var(--primary-text-black);
      text-decoration: underline;
    }
  }
  .btn-box {
    display: flex;
    justify-content: center;
    margin: 2rem 0;
    width: 100%;
  }

  .address {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 2rem;
    margin-top: 2rem;
    /* margin-bottom: 3rem; */
    .billing,
    .shipping {
      margin-top: 2rem;
    }
    p,
    h5 {
      text-align: center;
    }
  }

  @media screen and (min-width: 500px) {
    .btn-box {
      width: 70%;
      margin: 2rem auto;
    }
  }
  @media screen and (min-width: 700px) {
    .btn-box {
      width: 30%;
    }
  }
`;
export default InvoiceWrapper;
