import Icon from './Icon';
import styled from 'styled-components';

const CartButton = styled.button<{
  $bg?: string;
  $color?: string;
  $mb?: string;
  $wide?: string;
}>`
  display: block;
  background-color: ${(props) =>
    props.$bg ? props.$bg : 'var(--primary-color)'};
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-lg);
  border: none;
  margin-bottom: ${(props) => props.$mb};
  color: ${(props) =>
    props.$color ? props.$color : 'var(--primary-text-white)'};
  font-weight: 600;
  text-transform: uppercase;
  padding: 1.2rem 4rem;
  /* margin-top: -1rem; */
  width: ${(props) => (props.$wide ? props.$wide : '100%')};
  text-align: center;
  position: relative;
  outline: none;
  cursor: pointer;
  .cart-icon {
    background-color: var(--main-red-700);
    border-radius: var(--rounded);
    box-shadow: var(--shadow-md);
    position: absolute;
    top: 0;
    right: 0;
    padding: 1rem;
    width: 4rem;
    height: 4rem;
  }
  &:hover {
    background-color: var(--main-red-600);
    color: var(--primary-text-white);
  }
  &:disabled {
    background-color: var(--main-red-400);
  }
`;

const Button = ({
  type = 'submit',
  btnText,
  icon,
  color,
  bg,
  marginBottom,
  wide,
  disable = false,
  onBtnTrigger,
}: {
  btnText: string;
  icon: React.ReactNode;
  color?: string;
  bg?: string;
  marginBottom?: string;
  wide?: string;
  disable?: boolean;
  onBtnTrigger?: () => void;
  type?: 'button' | 'submit' | 'reset' | undefined;
}) => {
  return (
    <CartButton
      $wide={wide}
      $color={color}
      $bg={bg}
      $mb={marginBottom}
      disabled={disable}
      onClick={() => onBtnTrigger?.()}
      type={type}
    >
      <span>{btnText}</span>
      <span className='cart-icon'>
        <Icon icon={icon} />
      </span>
    </CartButton>
  );
};

export default Button;
