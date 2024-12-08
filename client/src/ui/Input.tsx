import styled from 'styled-components';

const Input = styled.input<{ $dark?: boolean; $capitalize?: boolean }>`
  display: block;
  background-color: ${(props) =>
    props.$dark ? 'var(--admin-input-bg)' : 'var(--grey)'};
  border: none;
  color: ${(props) =>
    props.$dark ? 'var(--admin-sec-text-color)' : 'var(--primary-text-black)'};
  text-transform: ${(props) =>
    props.$capitalize ? 'capitalize' : 'lowercase'};
  font-family: 'Lato', sans-serif;
  font-size: 1.4rem;
  padding: 1rem 2rem;
  outline: none;
  width: 100%;
  height: 4.4rem;
  &:disabled {
    background-color: ${(props) =>
      props.$dark ? 'var(--admin-input-bg)' : '#F5F5F5'};
  }
  &::placeholder {
    color: ${(props) =>
      props.$dark
        ? 'var(--admin-sec-text-color)'
        : 'var(--primary-text-black)'};
    text-transform: capitalize;
  }
`;

export const Label = styled.label`
  display: block;
  font-size: 1.6rem;
  color: var(--admin-sec-text-color);
  margin-bottom: 1rem;
  text-transform: capitalize;
`;
export default Input;
