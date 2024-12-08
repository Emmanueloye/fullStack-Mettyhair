import { FaRegStar, FaStar } from 'react-icons/fa';

// Star component
type StarPropsType = {
  isFull: boolean;
  onRate?: () => void;
  onStarMouseEnter?: () => void;
  onStarMouseLeave?: () => void;
};

const Star = ({
  isFull,
  onRate,
  onStarMouseEnter,
  onStarMouseLeave,
}: StarPropsType) => {
  return (
    <span
      onClick={() => onRate?.()}
      onMouseEnter={() => onStarMouseEnter?.()}
      onMouseLeave={() => onStarMouseLeave?.()}
    >
      {isFull ? <FaStar className='icon' /> : <FaRegStar className='icon' />}
    </span>
  );
};

export default Star;
