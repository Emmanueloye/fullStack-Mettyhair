import styled, { css } from 'styled-components';

export const OrderGrid = styled.div<{ type?: string; $isAction?: boolean }>`
  display: grid;
  grid-template-columns: 1.3fr 1fr 1fr 0.7fr 1fr 1fr ${(props) =>
      props.$isAction ? 0 : '0.5fr'};
  gap: 1rem;
`;

export const OrderLabel = styled.p`
  display: block;
  font-size: 1.4rem;
  color: var(--admin-sec-text-color);
  text-transform: capitalize;
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
