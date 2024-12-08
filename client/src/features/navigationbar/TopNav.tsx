import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { FaThreads } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import Icon from '../../ui/Icon';
import Row from '../../ui/Row';
import TopnavWrapper from './TopNavStyles';
import { User } from '../../dtos/userDto';
import { useAppSelector } from '../../store/hook';
import { DEFAULT_USER_IMG } from '../../utilities/constant';
import { SettingTypes } from '../../dtos/settingDto';

const TopNav = ({
  user,
  onLogout,
  setting,
}: {
  user: User;
  onLogout: () => void;
  setting?: SettingTypes;
}) => {
  const { isAuth } = useAppSelector((state) => state.auth);
  return (
    <TopnavWrapper>
      <Row>
        <div className='socials'>
          <Link to={setting?.instagram || ''} target='_blank'>
            <Icon icon={<FaInstagram />} iconSpacing='0.6rem' />
          </Link>
          <Link to={setting?.facebook || ''} target='_blank'>
            <Icon icon={<FaFacebook />} iconSpacing='0.6rem' />
          </Link>
          <Link to={setting?.thread || ''} target='_blank'>
            <Icon icon={<FaThreads />} iconSpacing='0.6rem' />
          </Link>
        </div>
        <div className='user-auth'>
          {isAuth && user && (
            <img
              src={user?.photo || DEFAULT_USER_IMG}
              width={23}
              height={23}
              alt='user image'
              className='img'
            />
          )}
          {isAuth && user ? (
            <>
              <Link to='/user/profile' className='link'>
                profile
              </Link>
              <p className='link' onClick={onLogout}>
                logout
              </p>
            </>
          ) : (
            <>
              <Link to='/login' className='link'>
                login
              </Link>
              <Link to='/register' className='link'>
                register
              </Link>
            </>
          )}
        </div>
      </Row>
    </TopnavWrapper>
  );
};

export default TopNav;
