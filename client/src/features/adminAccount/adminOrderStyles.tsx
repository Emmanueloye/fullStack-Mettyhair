import styled, { css } from 'styled-components';

export const FiveGrid = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr 1fr 0.3fr;
  gap: 1rem;
`;

export const BtnUI = styled.button`
  background-color: var(--primary-color);
  border: none;
  border-radius: 0.5rem;
  color: var(--main-light-blue);
  padding: 1rem 3rem;
  outline: none;
  text-transform: capitalize;
  ${(props) =>
    props.type === 'button' &&
    css`
      height: 4.4rem;
      /* margin-top: 3rem; */
    `};
`;
