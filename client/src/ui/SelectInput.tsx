import styled from 'styled-components';

export const Select = styled.select<{ $bg?: string; $width?: string }>`
  display: block;
  background-color: ${(props) => (props.$bg ? props.$bg : 'var(--grey)')};
  border: none;
  color: var(--admin-sec-text-color);
  font-family: 'Lato', sans-serif;
  font-size: 1.4rem;
  padding: 0.3rem 2rem;
  outline: none;
  width: ${(props) => (props.$width ? props.$width : '')};
  text-transform: capitalize;
  appearance: list-menu;
  /* height: 3.7rem; */
  height: 4.4rem;
  &:disabled {
    background-color: ${(props) =>
      props.$bg ? props.$bg : 'var(--main-red-50)'};
  }
`;

const SelectInput = ({
  children,
  bg,
  width,
  name,
  disabled,
  defaultValue,
}: {
  children: React.ReactNode;
  bg?: string;
  width?: string;
  name: string;
  disabled?: boolean;
  defaultValue?: string;
}) => {
  return (
    <Select
      $bg={bg}
      $width={width}
      name={name}
      disabled={disabled || false}
      defaultValue={defaultValue}
    >
      {children}
    </Select>
  );
};

export default SelectInput;
