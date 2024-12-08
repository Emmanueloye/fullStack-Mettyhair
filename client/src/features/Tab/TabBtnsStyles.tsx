import styled from 'styled-components';

const TabBtnsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--main-red-500);
  padding: 2.5rem 1rem;
  border-top-right-radius: var(--border-radius-lg);
  border-top-left-radius: var(--border-radius-lg);
  button,
  a {
    background-color: transparent;
    border: none;
    color: var(--main-red-150);
    font-size: 1.6rem;
    text-transform: capitalize;
    padding: 0.6rem 1.2rem;
    &:last-child {
      margin-bottom: 0;
    }
    &:hover {
      color: var(--primary-text-white);
    }
  }
  .active {
    background-color: var(--main-red-600);
    border-radius: 3rem;
    color: var(--primary-text-white);
  }

  @media screen and (min-width: 779px) {
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 3rem;
    button {
      margin-bottom: 0;
    }
  }
`;
export default TabBtnsWrapper;
