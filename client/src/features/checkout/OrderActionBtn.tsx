import { useSubmit } from 'react-router-dom';
import styled from 'styled-components';

const BtnWrapper = styled.button`
  background-color: var(--grey-2);
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-lg);
  border: none;
  margin-bottom: 2rem;
  font-weight: 600;
  text-transform: uppercase;
  padding: 1.2rem 4rem;
  margin-top: -1rem;
  text-align: center;
  outline: none;
  cursor: pointer;
  &:hover {
    background-color: var(--main-red-50);
    transition: var(--transition);
  }
`;

const OrderActionBtn = ({ id }: { id: string }) => {
  const submit = useSubmit();

  const handleReturn = () => {
    const proceed = window.confirm(
      'Are you sure you want to return the order?'
    );
    if (proceed) {
      const formData = new FormData();
      formData.append('id', id);
      formData.append('orderStatus', 'returned');
      submit(formData, { method: 'POST' });
    }
  };

  return <BtnWrapper onClick={handleReturn}>return order</BtnWrapper>;
};

export default OrderActionBtn;
