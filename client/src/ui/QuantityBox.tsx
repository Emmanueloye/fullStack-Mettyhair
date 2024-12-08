import styled from 'styled-components';

export const QtyWrapper = styled.div`
  display: flex;
  button {
    background-color: var(--primary-color);
    border: none;
    color: var(--primary-text-white);
    font-size: 1.4rem;
    padding: 1rem 1.5rem;
    cursor: pointer;
    &:disabled {
      background-color: var(--main-red-400);
    }
  }
  input {
    border: 0.5px solid var(--main-light-blue);
    font-size: 1.4rem;
    padding: 1rem 0;
    text-align: center;
    outline: none;
    width: 6rem;
  }
`;

const QuantityBox = ({
  showBtns = true,
  cartQty,
}: {
  showBtns?: boolean;
  cartQty?: number;
}) => {
  return (
    <QtyWrapper>
      {showBtns && <button>-</button>}
      <input type='text' defaultValue={cartQty} disabled />
      {showBtns && <button>+</button>}
    </QtyWrapper>
  );
};

export default QuantityBox;
