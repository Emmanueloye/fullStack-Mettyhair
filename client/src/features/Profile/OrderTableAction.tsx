import { FaDownload, FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const OrderAction = styled.div`
  display: flex;
  gap: 1rem;
  a,
  button {
    background-color: var(--main-red-600);
    padding: 0.6rem 1rem;
    font-size: 1.6rem;
    border: none;
    border-radius: var(--border-radius-sm);
    color: var(--main-red-50);
    &:hover {
      background-color: transparent;
      color: var(--primary-color);
      border: 1px solid var(--primary-color);
    }
  }
  .btn-blue {
    background-color: var(--primary-blue);
    color: var(--primary-color);
  }
`;

const OrderTableAction = ({
  view,
  download,
}: {
  view: string;
  download: string;
}) => {
  return (
    <OrderAction>
      <Link to={view} title='View'>
        <FaEye />
      </Link>
      <Link to={download} className='btn-blue' title='Download Receipt'>
        <FaDownload />
      </Link>
      {/* <button title='Cancel Order'>
        <FaTimes />
      </button> */}
    </OrderAction>
  );
};

export default OrderTableAction;
