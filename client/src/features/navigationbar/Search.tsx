// import { Form } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import Modal from '../../ui/Modal';
import Icon from '../../ui/Icon';
import { IoSearch } from 'react-icons/io5';
import FormBox from './SearchStyle';
import { uiActions } from '../../store/uiSlice';
import { useEffect, useState } from 'react';
import { getData, queryClient } from '../../api/requests';
import { slugifyText } from '../../utilities/HelperFunc';
import { searchAction } from '../../store/searchAction';
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { isModalOpen } = useAppSelector((state) => state.ui);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleEscapeKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dispatch(uiActions.closeModal());
      }
    };

    document.addEventListener('keyup', handleEscapeKeyPress);
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    setIsLoading(true);
    const resp = await queryClient.fetchQuery({
      queryKey: ['fetchProduct', 'product'],
      queryFn: () =>
        getData({
          url: `/products?search=productName&value=${slugifyText(
            data.search as string
          )}`,
        }),
    });
    setIsLoading(false);
    dispatch(searchAction.searchProduct(resp.products));
    navigate('/search/result');
    dispatch(uiActions.closeModal());
  };

  return (
    <>
      {isModalOpen && (
        <Modal>
          <FormBox>
            <form onSubmit={handleSubmit}>
              {/* <select name='category' id='category'>
                <option value='product'>Product</option>
                <option value='product'>Product</option>
                <option value='product'>Product</option>
              </select> */}
              <div className='input-search'>
                <input
                  type='text'
                  placeholder='Search products...'
                  name='search'
                />
                <button type='submit' className='btn'>
                  <Icon
                    icon={<IoSearch />}
                    iconSize='2.5rem'
                    color='var(--primary-color)'
                  />
                </button>
              </div>
            </form>
            <div className='btn-box'>
              <button
                className='close-btn'
                onClick={() => dispatch(uiActions.closeModal())}
              >
                {isLoading ? 'Searching...' : 'ESC - to close'}
              </button>
            </div>
          </FormBox>
        </Modal>
      )}
    </>
  );
};

export default Search;
