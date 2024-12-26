import styled from 'styled-components';

const AsideWrapper = styled.aside<{ $isOpen?: boolean }>`
  background-color: var(--primary-white);
  position: absolute;
  left: ${(props) => (props.$isOpen ? '-2.5rem' : '-150%')};
  top: -18rem;
  padding: 2rem;
  width: 80%;
  margin-top: 2rem;
  z-index: 30;
  transition: all 0.3s ease-in-out;
  .btn {
    background-color: var(--primary-color);
    border: none;
    color: var(--main-red-50);
    padding: 0 2rem;
  }
  .section h4 {
    margin-top: 2rem;
    margin-bottom: 2rem;
    border-bottom: 1px solid var(--main-red-200);
    text-transform: capitalize;
  }
  .clear-btn {
    background-color: var(--primary-color);
    border-radius: 1rem;
    padding: 0.8rem 1rem;
    color: var(--primary-white);
    font-size: 1.3rem;
    text-transform: capitalize;
    cursor: pointer;
  }
  .section li {
    border-bottom: 1px solid var(--main-red-200);
  }
  .btn-list {
    font-family: 'Quicksand', sans-serif;
    display: flex;
    align-items: center;
    gap: 1rem;
    background-color: transparent;
    border: none;
    font-size: 1.6rem;
    outline: none;
    text-transform: capitalize;
    padding: 1rem;
    width: 100%;
    cursor: pointer;

    span {
      font-size: 1.5rem;
    }

    &:hover {
      color: var(--primary-color);
      font-weight: 600;
    }
    .btn-text {
      flex: 1;
      text-align: left;
      /* padding: 0.3rem; */
    }
  }
  .sm-box {
    width: 2.5rem;
    height: 2rem;
    border: 1px solid var(--main-red-200);
    background-color: var(--primary-white);
    border-radius: var(--border-radius-md);
    padding: 0rem 0.9rem;
  }
  .active {
    background-color: var(--main-red-100);
  }
  .active-text {
    color: var(--primary-color);
    font-weight: 600;
  }

  .close-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2.5rem;
    color: var(--primary-color);
    margin-bottom: 1rem;
    cursor: pointer;
  }

  @media screen and (min-width: 680px) {
    left: ${(props) => (props.$isOpen ? '-3rem' : '-150%')};
  }
  @media screen and (min-width: 800px) {
    left: ${(props) => (props.$isOpen ? '-5rem' : '-150%')};
  }
  @media screen and (min-width: 1024px) {
    position: static;
    left: 0;
    width: 100%;
    height: fit-content;
    z-index: 1;
    .close-btn {
      display: none;
    }
  }
  @media screen and (max-width: 450px) {
    width: 100%;
  }
`;
export default AsideWrapper;
