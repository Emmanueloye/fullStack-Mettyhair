import { useSearchParams } from 'react-router-dom';
import { PAGE_SIZE } from '../utilities/constant';
import styled from 'styled-components';

const ReportPageBox = styled.div`
  display: flex;
  justify-content: space-between;
  border-top: 2px solid gray;
  margin-top: 3rem;
  padding-top: 1rem;
  .btn {
    background-color: var(--main-red-600);
    border: none;
    border-radius: 4rem;
    color: var(--white);
    padding: 1rem 2rem;
    outline: none;
    margin-left: 1rem;
    cursor: pointer;
    &:disabled {
      background-color: var(--main-red-400);
      cursor: not-allowed;
    }
  }
  p {
    color: var(--main-red-600);
  }
`;

const ReportPagination = ({ numbOfResults }: { numbOfResults: number }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  //   Current page
  const currentPage = !searchParams.get('page')
    ? 1
    : Number(searchParams.get('page'));

  const pageCount = Math.ceil(numbOfResults / PAGE_SIZE);

  const nexPage = () => {
    const next = currentPage === pageCount ? currentPage : currentPage + 1;
    searchParams.set('page', `${next}`);
    setSearchParams(searchParams);
  };
  const prevPage = () => {
    const prev = currentPage === 1 ? currentPage : currentPage - 1;
    searchParams.set('page', `${prev}`);
    setSearchParams(searchParams);
  };

  // Review later to 10
  if (numbOfResults <= PAGE_SIZE) return null;
  return (
    <ReportPageBox>
      <p>
        Showing <span>{(currentPage - 1) * PAGE_SIZE + 1}</span> to{' '}
        <span>
          {currentPage === pageCount ? numbOfResults : currentPage * PAGE_SIZE}
        </span>
        of <span>{numbOfResults}</span> results
      </p>
      <div>
        <button className='btn' disabled={currentPage === 1} onClick={prevPage}>
          Prev
        </button>
        <button
          className='btn'
          disabled={currentPage === pageCount}
          onClick={nexPage}
        >
          Next
        </button>
      </div>
    </ReportPageBox>
  );
};

export default ReportPagination;
