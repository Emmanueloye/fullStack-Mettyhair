import {
  FaArrowDown,
  FaArrowUp,
  FaEye,
  FaPenAlt,
  FaTrashAlt,
} from 'react-icons/fa';
import { Link, useSubmit } from 'react-router-dom';
import styled from 'styled-components';

export const ActionBtnWrapper = styled.div`
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

const ActionsBtns = ({
  showActivation = false,
  isActive = true,
  viewURL,
  editURL,
  showDelete = true,
  id,
}: {
  showActivation?: boolean;
  isActive?: boolean;
  viewURL: string;
  editURL: string;
  showDelete?: boolean;
  id?: string;
}) => {
  const submit = useSubmit();

  const handleDelete = () => {
    const proceed = window.confirm('Are you sure you want to delete?');
    if (proceed) {
      const formData = new FormData();
      formData.append('id', id as string);
      submit(formData, { method: 'DELETE' });
    }
  };

  const handleDeactivate = () => {
    const proceed = window.confirm('Are you sure you want to deactivate?');
    if (proceed) {
      const formData = new FormData();
      formData.append('id', id as string);
      formData.append('isActive', 'false');
      submit(formData, { method: 'PATCH' });
    }
  };

  const handleActivate = () => {
    const proceed = window.confirm('Are you sure you want to activate?');
    if (proceed) {
      const formData = new FormData();
      formData.append('id', id as string);
      formData.append('isActive', 'true');
      submit(formData, { method: 'PATCH' });
    }
  };
  const activationBtns = showActivation && (
    <>
      {isActive ? (
        <button title='Deactivate' onClick={handleDeactivate}>
          <FaArrowDown />
        </button>
      ) : (
        <button className='btn-blue' title='Activate' onClick={handleActivate}>
          <FaArrowUp />
        </button>
      )}
    </>
  );

  return (
    <ActionBtnWrapper>
      <Link to={editURL} title='Edit' className='btn-blue'>
        <FaPenAlt />
      </Link>
      <Link to={viewURL} title='View' className='btn-blue'>
        <FaEye />
      </Link>
      {activationBtns}
      {showDelete && (
        <button title='Delete' onClick={handleDelete}>
          <FaTrashAlt />
        </button>
      )}
    </ActionBtnWrapper>
  );
};

export default ActionsBtns;
