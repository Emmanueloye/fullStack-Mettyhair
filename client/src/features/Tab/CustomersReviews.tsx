import { ReviewTypes } from '../../dtos/productsDto';
import Reviews from './Reviews';
import { Center, TabContentWrapper } from './TabContentWrapper';

const CustomersReviews = ({ reviews }: { reviews: ReviewTypes[] }) => {
  return (
    <TabContentWrapper>
      {reviews.length > 1 ? (
        <p style={{ textAlign: 'center' }}>
          See what our customers are saying.
        </p>
      ) : (
        <p style={{ textAlign: 'center' }}>
          No review for now. Please check back later. You can also drop you own
          review as well.
        </p>
      )}
      <Center>
        {reviews
          .filter((item) => item.isApproved === true)
          .slice(0, 10)
          .map((review) => (
            <Reviews review={review} key={review._id} />
          ))}
      </Center>
    </TabContentWrapper>
  );
};

export default CustomersReviews;
