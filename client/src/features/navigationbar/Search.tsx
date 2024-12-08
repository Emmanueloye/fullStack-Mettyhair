import { Form } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import Modal from '../../ui/Modal';
import Icon from '../../ui/Icon';
import { IoSearch } from 'react-icons/io5';
import FormBox from './SearchStyle';
import { uiActions } from '../../store/uiSlice';
import { useEffect } from 'react';

const Search = () => {
  const { isModalOpen } = useAppSelector((state) => state.ui);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleEscapeKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dispatch(uiActions.closeModal());
      }
    };

    document.addEventListener('keyup', handleEscapeKeyPress);
  }, [dispatch]);

  return (
    <>
      {isModalOpen && (
        <Modal>
          <FormBox>
            <Form>
              <select name='category' id='category'>
                <option value='product'>Product</option>
                <option value='product'>Product</option>
                <option value='product'>Product</option>
              </select>
              <div className='input-search'>
                <input type='text' placeholder='Search...' />
                <button type='submit' className='btn'>
                  <Icon
                    icon={<IoSearch />}
                    iconSize='2.5rem'
                    color='var(--primary-color)'
                  />
                </button>
              </div>
            </Form>
            <div className='btn-box'>
              <button
                className='close-btn'
                onClick={() => dispatch(uiActions.closeModal())}
              >
                ESC - to close
              </button>
            </div>
          </FormBox>
        </Modal>
      )}
    </>
  );
};

export default Search;
