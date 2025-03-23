import styled from 'styled-components';

export const StatementBox = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  /* border: 1px solid gray; */
  padding: 1.2rem;
  overflow-x: auto;

  .grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    cursor: pointer;
    &:first-child {
      margin-top: 1rem;
    }
  }
  .header-box {
    font-size: 1.4rem;
    margin-bottom: 1rem;
    span {
      margin-left: 1rem;
      text-transform: capitalize;
      &:first-child {
        font-weight: 600;
      }
    }
  }
  .color-red {
    color: var(--main-red-700);
  }
  .lines {
    &:nth-of-type(odd) {
      background-color: var(--grey-2);
    }
  }
  .evenLines {
    &:nth-last-of-type(even) {
      color: var(--main-red-300);
    }
  }
  .color {
    /* color: var(--admin-sec-text-color); */
    color: var(--main-red-300);
  }

  p {
    font-size: 1.3rem;
    padding: 0.5rem;
  }
  .box {
    border: 1px solid gray;
    padding: 1.2rem;
  }
`;
