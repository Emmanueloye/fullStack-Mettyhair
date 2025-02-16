import { useState } from 'react';
import { FaAngleDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const SalesOrderActionBox = styled.div`
  position: relative;
  height: 100%;
  .label {
    display: flex;
    align-items: center;
    cursor: pointer;
    span:last-child {
      margin-top: 0.6rem;
    }
  }
  .dropdown {
    display: none;
    background-color: var(--admin-primary-color);
    position: absolute;
    top: 96%;
    padding: 1rem;
    z-index: 10;
    width: 10rem;
  }
  li {
    margin-bottom: 1rem;
  }
  li:last-child {
    margin-bottom: 0;
  }
  a {
    color: var(--admin-text-color);
  }
  .show {
    display: block;
  }
`;

const SalesOrderAction = ({
  editURL,
  invoiceURL,
  paymentURL,
  viewURL,
  hideEdit = true,
}: {
  editURL?: string;
  invoiceURL?: string;
  paymentURL?: string;
  viewURL?: string;
  hideEdit?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownClass = isOpen ? 'dropdown show' : 'dropdown';

  return (
    <SalesOrderActionBox>
      <div className='label' onClick={() => setIsOpen(!isOpen)}>
        <span>Action</span>
        <span>
          <FaAngleDown />
        </span>
      </div>
      <ul className={dropdownClass}>
        {viewURL && (
          <li>
            <Link to={viewURL}>view</Link>
          </li>
        )}
        {editURL && hideEdit && (
          <li>
            <Link to={editURL}>Edit</Link>
          </li>
        )}
        {invoiceURL && (
          <li>
            <Link to={invoiceURL}>Invoice</Link>
          </li>
        )}
        {paymentURL && (
          <li>
            <Link to={paymentURL}>Payment</Link>
          </li>
        )}
      </ul>
    </SalesOrderActionBox>
  );
};

export default SalesOrderAction;
