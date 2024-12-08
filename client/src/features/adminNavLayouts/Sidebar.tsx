import { useAppDispatch, useAppSelector } from '../../store/hook';
import { FaTimesCircle } from 'react-icons/fa';
import { adminUIActions } from '../../store/adminUI';
import AdminSidebar from './SidebarStyles';
import Accordion from '../adminAccordion/Accordion';
import { User } from '../../dtos/userDto';
import { DEFAULT_USER_IMG } from '../../utilities/constant';

const Sidebar = ({ user }: { user: User }) => {
  const { isAdminSidebarOpen } = useAppSelector((state) => state.adminUI);
  const dispatch = useAppDispatch();
  return (
    <AdminSidebar $isOpen={isAdminSidebarOpen}>
      <div className='user-box'>
        <img
          src={user?.photo || DEFAULT_USER_IMG}
          alt='User Avatar'
          width={60}
          height={60}
        />
        <div className='box'>
          <h5>{user?.fullName}</h5>
          <p>Administrator</p>
        </div>
        <div
          className='icon-box'
          onClick={() => dispatch(adminUIActions.closeAdminSidebar())}
        >
          <FaTimesCircle />
        </div>
      </div>
      {/* Sidebar menu */}
      <Accordion user={user} />
    </AdminSidebar>
  );
};

export default Sidebar;
