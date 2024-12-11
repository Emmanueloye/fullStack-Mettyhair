import { NavLink } from 'react-router-dom';
import { formatNumber } from '../../../utilities/HelperFunc';

const PriceFilter = () => {
  // Revisit
  // const handleClick = (e: React.MouseEvent<HTMLUListElement, MouseEvent>) => {
  //   (e.target as HTMLUListElement)
  //     .closest('button')
  //     ?.classList.toggle('active-text');
  // };
  return (
    <ul className='section price'>
      <h4>Price</h4>
      <p>clear</p>
      <li className='list'>
        <NavLink
          to={`/products?price<50000`}
          className={({ isActive }) =>
            isActive ? 'btn-list active' : 'btn-list'
          }
        >
          <span>Less than &#8358;{formatNumber(50_000)}</span>
        </NavLink>
      </li>
      <li className='list'>
        <NavLink
          to={`/products?price<100000`}
          className={({ isActive }) =>
            isActive ? 'btn-list active' : 'btn-list'
          }
        >
          <span className={''}>Less than &#8358;{formatNumber(100_000)}</span>
        </NavLink>
      </li>
      <li className='list'>
        <NavLink
          to={`/products/price<200000`}
          className={({ isActive }) =>
            isActive ? 'btn-list active' : 'btn-list'
          }
        >
          <span className={''}>
            &#8358;{formatNumber(100_001)} - &#8358;{formatNumber(200_000)}
          </span>
        </NavLink>
      </li>
      <li className='list'>
        <NavLink
          to={``}
          className={({ isActive }) =>
            isActive ? 'btn-list active' : 'btn-list'
          }
        >
          <span className={''}>
            &#8358;{formatNumber(200_001)} - &#8358;{formatNumber(300_000)}
          </span>
        </NavLink>
      </li>
      <li className='list'>
        <NavLink
          to={``}
          className={({ isActive }) =>
            isActive ? 'btn-list active' : 'btn-list'
          }
        >
          <span className={''}>Above &#8358;{formatNumber(300_000)}</span>
        </NavLink>
      </li>
    </ul>
  );
};

export default PriceFilter;
