import { useRef, useState } from 'react';
import { FaAngleDown, FaLock, FaUserAlt } from 'react-icons/fa';
import { MdCreateNewFolder } from 'react-icons/md';
import { RiLogoutCircleFill } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import AuthDropdown from './AuthMenuStyles';
import { User } from '../../dtos/userDto';

const AuthMenu = ({ user, onLogout }: { user: User; onLogout: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [height, setHeight] = useState<number>(0);
  const authMenuRef = useRef(null);
  const boxRef = useRef(null);

  //   Get the current height of the inner ul and pass it to css via styled component props.
  const handleClick = () => {
    const height = (
      authMenuRef.current! as HTMLUListElement
    ).getBoundingClientRect().height;
    setHeight(height + 40);
    setIsOpen(!isOpen);
  };

  return (
    <AuthDropdown $isOpen={isOpen} $height={isOpen ? height : 0}>
      <div className='menu-btn' onClick={handleClick}>
        <h5>{user?.fullName?.split(' ')[0]}</h5>
        <FaAngleDown className='icon' />
      </div>
      <div className='menu' ref={boxRef}>
        <ul ref={authMenuRef}>
          <li>
            <Link to='/admin/profile' onClick={() => setIsOpen(false)}>
              <span>
                <FaUserAlt />
              </span>
              <span>Profile</span>
            </Link>
          </li>
          <li>
            <Link to='/admin/change-password' onClick={() => setIsOpen(false)}>
              <span>
                <FaLock />
              </span>
              <span>Change password</span>
            </Link>
          </li>
          {user?.role?.startsWith('super') && (
            <li>
              <Link to='/admin/Create-admin' onClick={() => setIsOpen(false)}>
                <span>
                  <MdCreateNewFolder />
                </span>
                <span>Create admin</span>
              </Link>
            </li>
          )}
          <li>
            <button onClick={onLogout}>
              <span>
                <RiLogoutCircleFill />
              </span>
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </AuthDropdown>
  );
};

export default AuthMenu;
