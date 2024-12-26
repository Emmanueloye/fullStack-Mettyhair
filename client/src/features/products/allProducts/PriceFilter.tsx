import { formatNumber } from '../../../utilities/HelperFunc';
import { priceRanges } from '../../../data/priceRange';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const PriceFilter = () => {
  const [index, setIndex] = useState<number | null>();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    i: number
  ) => {
    const [min, max] = e.currentTarget.textContent!.split('-');
    const minRange = min.trim().split(',').join('');
    const maxRange = max.trim().split(',').join('');

    searchParams.set('range', `${minRange},${maxRange}`);
    setSearchParams(searchParams);
    setIndex(i);
  };

  const handleClear = () => {
    searchParams.delete('range');
    setSearchParams(searchParams);
    setIndex(null);
  };

  return (
    <ul className='section price'>
      <h4>Price</h4>
      <p className='clear-btn' onClick={handleClear}>
        clear filter
      </p>
      {priceRanges.map((range, i) => {
        const activeClass = index === i ? 'btn-list active' : 'btn-list';
        return (
          <li className='list' key={range.id}>
            <button className={activeClass} onClick={(e) => handleClick(e, i)}>
              {typeof range.min === 'string'
                ? range.min
                : formatNumber(range.min)}{' '}
              - {formatNumber(range.max)}
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default PriceFilter;
