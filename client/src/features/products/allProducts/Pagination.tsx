import { Link } from 'react-router-dom';
import styled from 'styled-components';

const PageWrapper = styled.div<{ $mt?: string }>`
  display: flex;
  justify-content: flex-end;
  margin-top: ${(props) => (props.$mt ? props.$mt : '8rem')};
  .box {
    display: flex;
    flex-wrap: wrap;
    /* gap: 1rem; */
    button,
    a,
    span {
      background-color: var(--primary-color);
      box-shadow: var(--shadow-md);
      border-top-left-radius: var(--border-radius-lg);
      border-bottom-left-radius: var(--border-radius-lg);
      border: none;
      color: var(--primary-white);
      font-weight: 600;
      text-transform: uppercase;
      padding: 1.2rem 3rem;
      text-align: center;
      position: relative;
      outline: none;
      cursor: pointer;
    }
    span {
      background-color: var(--primary-blue);
      color: var(--primary-color);
      font-weight: 900;
      border-radius: 0;
      cursor: unset;
    }
    .next {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      border-top-right-radius: var(--border-radius-lg);
      border-bottom-right-radius: var(--border-radius-lg);
    }
  }
  button:disabled {
    background-color: var(--main-red-300);
    cursor: not-allowed;
  }

  @media screen and (max-width: 328px) {
    justify-content: center;
    .box {
      flex-direction: column;
      button {
        border-radius: 0;
      }
      .next {
        border-radius: 0;
      }
    }
  }
`;

const Pagination = ({
  totalPages,
  currentPage,
  nextPage,
  previousPage,
  pageLink,
  marginTop,
}: {
  totalPages: number;
  currentPage: number;
  nextPage?: number;
  previousPage?: number;
  pageLink: string;
  marginTop?: string;
}) => {
  return (
    <PageWrapper $mt={marginTop}>
      <div className='box'>
        <Link
          to={`${pageLink}?page=${previousPage ? previousPage : currentPage}`}
        >
          Prev
        </Link>
        <span>
          {currentPage} of {totalPages}
        </span>
        <Link
          to={`${pageLink}?page=${nextPage ? nextPage : currentPage}`}
          className='next'
        >
          Next
        </Link>
        {/* <button className='next'>Next</button> */}
      </div>
    </PageWrapper>
  );
};

export default Pagination;
