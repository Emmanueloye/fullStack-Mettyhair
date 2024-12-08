import { FaBars } from 'react-icons/fa';
import BrandText from '../../ui/Brand';
import CartAndSearch from '../../ui/CartAndSearch';
import Icon from '../../ui/Icon';
import Nav from './Nav';
import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import MainNavWrapper from './MinNavStyles';
import Search from './Search';
import MegaMenu from './MegaMenu';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { uiActions } from '../../store/uiSlice';
import { useEffect, useRef, useState } from 'react';
import { User } from '../../dtos/userDto';
import { CategoriesType, SubcategoriesType } from '../../dtos/categoriesDto';
import { CartTypes } from '../../dtos/productsDto';

const MainNav = ({
  user,
  categories,
  subcategories,
  carts,
}: {
  user: User;
  categories: CategoriesType[];
  subcategories: SubcategoriesType[];
  carts: CartTypes[];
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLUListElement>(null);
  const dispatch = useAppDispatch();

  const { isAuth } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isMobileMenuOpen) {
      const height = innerRef.current!.getBoundingClientRect().height;
      boxRef.current!.style.height = `${height}px`;
    } else {
      boxRef.current!.style.height = '0px';
    }
  }, [isMobileMenuOpen]);

  // close submenu when mouse move away from the product link
  const hideSubmenuHandler = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!(e.target as HTMLElement).classList.contains('product-tab')) {
      dispatch(uiActions.closeSubmenu());
    }
  };
  return (
    <Nav>
      <MainNavWrapper onMouseOver={hideSubmenuHandler}>
        <div className='mobile-view'>
          <Link to='/'>
            <BrandText>
              Metty<span>Hair</span>
            </BrandText>
          </Link>
          {/* cart bag */}
          <CartAndSearch cartQty={carts.length} className='hidden' />
          {/* mobile toggle icon */}
          <span onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <Icon icon={<FaBars />} iconSize='2rem' className='hidden' />
          </span>
        </div>
        <div ref={boxRef} className='main-box'>
          <ul className='nav-links' ref={innerRef}>
            <li>
              <NavLink
                to='/'
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
                home
              </NavLink>
            </li>
            <li
              className='submenu-link product-tab'
              onMouseOver={() => dispatch(uiActions.openSubmenu())}
            >
              <NavLink
                to='/products'
                className={({ isActive }) =>
                  isActive ? 'product-tab  active' : 'product-tab'
                }
              >
                product
              </NavLink>
              {/* Mega menu */}
              <MegaMenu categories={categories} subcategories={subcategories} />
            </li>
            <li>
              <NavLink
                to='/contact'
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
                contact
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/blog'
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
                blog
              </NavLink>
            </li>
            {isAuth && ['admin', 'super-admin'].includes(user?.role) && (
              <li>
                <NavLink
                  to='/admin'
                  className={({ isActive }) =>
                    isActive ? 'active' : undefined
                  }
                >
                  Admin
                </NavLink>
              </li>
            )}
          </ul>
        </div>
        <CartAndSearch cartQty={carts?.length} className='hidden-sm' />
      </MainNavWrapper>
      <Search />
    </Nav>
  );
};

export default MainNav;
