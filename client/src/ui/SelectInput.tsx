import styled from 'styled-components';

export const Select = styled.select<{ $bg?: string; $width?: string }>`
  display: block;
  background-color: ${(props) => (props.$bg ? props.$bg : 'var(--grey)')};
  border: none;
  color: ${(props) =>
    props.$bg ? 'var(--admin-sec-text-color)' : 'var(--primary-text-black)'};
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
  onInputChange,
}: {
  children: React.ReactNode;
  bg?: string;
  width?: string;
  name: string;
  disabled?: boolean;
  defaultValue?: string;
  onInputChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => {
  return (
    <Select
      $bg={bg}
      $width={width}
      name={name}
      disabled={disabled || false}
      defaultValue={defaultValue}
      onChange={(e) => onInputChange?.(e)}
      className='capitalize'
    >
      {children}
    </Select>
  );
};

export default SelectInput;
