import { useEffect, useState } from 'react';
import RatingWrapper from './RatingStyles';
import Star from './Star';

type RatingType = {
  maxRating?: number;
  showRating?: boolean;
  showNumReview?: boolean;
  color?: string;
  size?: string;
  staticRating?: boolean;
  productRating?: number;
  numReview?: number | string;
  getRating?: (rating: number) => void;
};

// Rating component
const Rating = ({
  maxRating = 5,
  showRating = false,
  showNumReview = false,
  color,
  size,
  numReview,
  staticRating = true,
  productRating = 0,
  getRating,
}: RatingType) => {
  const [rating, setRating] = useState(0);
  const [tempRating, setTempRating] = useState(0);

  useEffect(() => {
    setRating(productRating);
  }, [productRating]);

  return (
    <RatingWrapper $color={color} $size={size}>
      {/* For static review */}
      {staticRating ? (
        <div className='group'>
          {Array.from({ length: maxRating }).map((_, i) => (
            <Star key={i} isFull={rating >= i + 1} />
          ))}
        </div>
      ) : (
        <div className='group'>
          {Array.from({ length: maxRating }).map((_, i) => (
            <Star
              key={i}
              isFull={tempRating ? tempRating >= i + 1 : rating >= i + 1}
              onRate={() => {
                setRating(i + 1);
                getRating?.(i + 1);
              }}
              onStarMouseEnter={() => setTempRating(i + 1)}
              onStarMouseLeave={() => setTempRating(0)}
            />
          ))}
          <input type='text' hidden name='rating' defaultValue={rating} />
        </div>
      )}
      {showRating && (
        <p className='rate'>
          {tempRating || rating}/<span>{maxRating}</span>
        </p>
      )}
      {showNumReview && (
        <p>
          ({numReview} customer{(numReview as number) > 1 ? 's' : ''} review
          {(numReview as number) > 1 ? 's' : ''})
        </p>
      )}
    </RatingWrapper>
  );
};

export default Rating;
