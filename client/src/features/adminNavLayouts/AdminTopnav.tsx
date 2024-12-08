import styled from 'styled-components';
import SiteMode, { ModeBtn } from './SiteMode';
import { BrandLink } from '../../ui/Brand';
import { Link } from 'react-router-dom';
import AuthMenu from './AuthMenu';
import { FaBars } from 'react-icons/fa';
import { useAppDispatch } from '../../store/hook';
import { adminUIActions } from '../../store/adminUI';
import { User } from '../../dtos/userDto';

const AdminNavWrapper = styled.nav`
  background-color: var(--admin-primary-color);
  padding: 3rem 1rem;
  height: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  position: sticky;
  top: 0;
  z-index: 3;
  .auth {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 3rem;
  }

  @media screen and (min-width: 560px) {
    height: 8rem;
    padding: 2rem 3rem;
  }
`;

const AdminTopnav = ({
  user,
  onLogout,
}: {
  user: User;
  onLogout: () => void;
}) => {
  const dispatch = useAppDispatch();

  return (
    <AdminNavWrapper>
      <ModeBtn onClick={() => dispatch(adminUIActions.toggleAdiminSidebar())}>
        <FaBars />
      </ModeBtn>
      <BrandLink>
        <Link to='/'>
          Metty<span>Hair</span>
        </Link>
      </BrandLink>

      <div className='auth'>
        <SiteMode />
        <AuthMenu user={user} onLogout={onLogout} />
      </div>
    </AdminNavWrapper>
  );
};

export default AdminTopnav;
