import styled from 'styled-components';
import SiteMode, { ModeBtn } from './SiteMode';
import { BrandLink } from '../../ui/Brand';
import { Link } from 'react-router-dom';
import AuthMenu from './AuthMenu';
import { FaBars, FaHome } from 'react-icons/fa';
import { useAppDispatch } from '../../store/hook';
import { adminUIActions } from '../../store/adminUI';
import { User } from '../../dtos/userDto';
import { MdMail } from 'react-icons/md';

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

  @keyframes blink {
    from {
      transform: scale(0);
    }
    to {
      transform: scale(1.1);
    }
  }

  .mail {
    position: relative;
  }
  .badge {
    color: var(--secondary-text-white);
    background-color: var(--primary-white);
    border-radius: 50%;
    font-weight: 600;
    position: absolute;
    top: 0.6rem;
    right: 0.6rem;
    width: 1rem;
    height: 1rem;
    animation: blink 0.4s infinite;
  }

  @media screen and (min-width: 560px) {
    height: 8rem;
    padding: 2rem 3rem;
  }
`;

const AdminTopnav = ({
  user,
  onLogout,
  unread = 0,
}: {
  user: User;
  onLogout: () => void;
  unread?: number;
}) => {
  const dispatch = useAppDispatch();

  return (
    <AdminNavWrapper>
      <ModeBtn onClick={() => dispatch(adminUIActions.toggleAdiminSidebar())}>
        <FaBars />
      </ModeBtn>
      <BrandLink>
        <Link to='/'>
          <FaHome />
        </Link>
      </BrandLink>

      <div className='auth'>
        <SiteMode />
        <Link to='/admin/contacts' className='mail'>
          <ModeBtn>
            <MdMail />
          </ModeBtn>
          {unread > 0 && <span className='badge'></span>}
        </Link>
        <AuthMenu user={user} onLogout={onLogout} />
      </div>
    </AdminNavWrapper>
  );
};

export default AdminTopnav;
