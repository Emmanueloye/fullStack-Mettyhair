import styled from 'styled-components';

const TextArea = styled.textarea<{ $dark?: boolean }>`
  display: block;
  background-color: ${(props) =>
    props.$dark ? 'var(--admin-input-bg)' : 'var(--grey)'};
  border: none;
  color: var(--admin-sec-text-color);
  font-family: 'Lato', sans-serif;
  font-size: 1.4rem;
  padding: 1rem 2rem;
  outline: none;
  width: 100%;
  white-space: pre-wrap; //pre-line
  &:disabled {
    background-color: ${(props) =>
      props.$dark ? 'var(--admin-input-bg)' : '#F5F5F5'};
  }
`;

export default TextArea;
