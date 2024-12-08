import styled from 'styled-components';

const FooterWrapper = styled.footer<{ $bg?: string }>`
  background: url(${(props) => props.$bg}) no-repeat center;
  background-size: cover;
  width: 100%;
  margin-top: 3rem;
  text-transform: capitalize;
  padding-top: 3rem;
  .grid {
    display: grid;
    grid-template-columns: 1fr;
    text-align: center;
    padding-bottom: 2rem;
    padding-top: 4rem;

    .header {
      color: var(--main-red-100);
      line-height: 0;
      margin-bottom: 1rem;
      h3 {
        font-size: 1.6rem;
      }
    }
    li {
      display: flex;
      justify-content: center;
      margin-bottom: 1.3rem;
    }
    a {
      color: var(--main-red-150);
      font-size: 1.4rem;
      text-transform: capitalize;
      &:hover {
        color: var(--primary-blue);
      }
    }
  }
  .footer-note {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    color: var(--main-red-150);
    small {
      margin-bottom: 1rem;
    }
  }

  @media screen and (min-width: 600px) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem;
    }
  }
  @media screen and (min-width: 1024px) {
    background-position: unset;
    padding-bottom: 3rem;
    padding-top: 6rem;
    .grid {
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;
    }
  }
`;

export default FooterWrapper;
