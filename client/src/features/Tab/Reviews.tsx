import { FaCalendar } from 'react-icons/fa';
import Icon from '../../ui/Icon';
import Rating from '../../ui/Rating';
import styled from 'styled-components';
import { ReviewTypes } from '../../dtos/productsDto';
import { formatDate } from '../../utilities/HelperFunc';

const ReviewWrapper = styled.article`
  display: flex;
  flex-direction: column;
  background-color: var(--main-red-100);
  padding: 1.2rem 3rem;
  margin-top: 2rem;
  border-radius: var(--border-radius-md); /* width: 80%; */
  .review-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    /* gap: 3rem; */
    img {
      border-radius: var(--rounded);
    }
  }
  .review-body {
    margin-top: 2rem;
    /* margin-left: 6rem; */
  }
  h4 {
    font-size: 1.4rem;
  }
  .user {
    text-align: center;
  }
  @media screen and (min-width: 540px) {
    padding: 2rem 6rem;

    &:nth-of-type(odd) {
      border-top-right-radius: 12rem;
      border-bottom-left-radius: 12rem;
    }
    &:nth-of-type(even) {
      border-top-left-radius: 12rem;
      border-bottom-right-radius: 12rem;
    }
    .review-header {
      flex-direction: row;
      gap: 2rem;
    }

    .user {
      text-align: left;
    }
  }

  @media screen and (min-width: 776px) {
    width: 80%;
    .review-body {
      margin-left: 6rem;
    }
    &:nth-of-type(even) {
      margin-left: 8rem;
    }
    &:nth-of-type(odd) {
      padding-bottom: 3rem;
      margin-right: 8rem;
    }
  }
`;

const Reviews = ({ review }: { review: ReviewTypes }) => {
  return (
    <ReviewWrapper>
      <div className='review-header'>
        <img src={review.user.photo} width={50} height={50} alt='user' />
        <div className='user'>
          <h4 className='capitalize'>{review.user.fullName}</h4>
          <Rating
            productRating={review.rating}
            staticRating={true}
            size='1.3rem'
          />
          <div>
            <Icon
              icon={<FaCalendar />}
              iconSize='1rem'
              text={formatDate(new Date(review.createdAt))}
              color='var(--primary-text-black)'
              space='1rem'
              textSize='1rem'
            />
          </div>
        </div>
      </div>
      <div className='review-body'>
        <p>{review.review}</p>
      </div>
    </ReviewWrapper>
  );
};

export default Reviews;
