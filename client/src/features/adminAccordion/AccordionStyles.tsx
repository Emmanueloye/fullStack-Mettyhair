import styled from 'styled-components';

export const AccordionLink = styled.div`
  .btn,
  .btn-acc-main {
    display: flex;
    align-items: center;
    font-family: 'Quicksand', sans-serif;
    font-size: 1.4rem;
    color: var(--admin-text-color);
    border-bottom: 1px solid var(--admin-text-color);
    padding: 0.4rem 1rem;
    margin-bottom: 2rem;
    text-transform: capitalize;
    cursor: pointer;

    span {
      margin-bottom: 0.4rem;
      &:nth-of-type(1) {
        margin-right: 1rem;
      }
      &:nth-of-type(2) {
        flex: 1;
      }
    }
    &:hover {
      border-radius: var(--border-radius-sm);
    }
  }
  .btn-plus,
  .btn-acc {
    background-color: transparent;
    border-top: none;
    border-left: none;
    border-right: none;
    width: 100%;
    span {
      &:nth-of-type(2) {
        text-align: left;
      }
    }
  }
  .btn-acc-main {
    border-bottom: 1px solid var(--main-red-300);
  }
  .btn-acc {
    color: var(--main-red-400);
    font-weight: 700;
  }
  .active {
    background-color: var(--main-red-600);
    border-radius: var(--border-radius-sm);
  }
`;

export const AccordionSubLink = styled.div<{ $isOpen?: boolean }>`
  display: ${(props) => (props.$isOpen ? 'block' : 'none')};
  margin-left: 3rem;
  margin-bottom: 3rem;
  li {
    border-bottom: 1px solid var(--admin-text-color);
    &:first-child {
      margin-top: -1rem;
    }
    margin-bottom: 1.3rem;
  }
  a {
    display: block;
    color: var(--admin-sec-text);
    text-transform: capitalize;
    font-size: 1.4rem;
    padding: 0.4rem;
    &:hover {
      color: var(--main-light-blue-1);
    }
  }
  .show {
    display: block;
  }
  .active {
    color: var(--white);
  }
  .gen-active {
    color: var(--admin-sec-text-color);
    &:hover {
      color: var(--main-red-300);
    }
  }
  .list {
    border-bottom: 1px solid var(--main-red-400);
  }
`;
