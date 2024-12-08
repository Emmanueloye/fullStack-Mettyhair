import { Link, useLocation } from 'react-router-dom';
import { TabContentWrapper } from '../Tab/TabContentWrapper';
import LinkBtn from '../../ui/LinkBtn';

import { ImageBox, InfoWrapper } from './ProfileContentStyles';
import { User } from '../../dtos/userDto';
import { DEFAULT_USER_IMG } from '../../utilities/constant';

const ProfileContent = ({
  user,
  editURL,
  addressURL,
  isDark,
}: {
  user: User;
  editURL: string;
  addressURL: string;
  isDark?: boolean;
}) => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <TabContentWrapper $dark={isDark}>
      <ImageBox>
        <img
          src={user?.photo || DEFAULT_USER_IMG}
          width={80}
          height={80}
          alt='user image'
        />
        <div className='edit-link'>
          <LinkBtn btnText='edit' url={editURL} />
        </div>
      </ImageBox>
      <InfoWrapper $dark={isDark}>
        <div className='details'>
          <p>name</p>
          <h5>{user?.fullName}</h5>
        </div>
        <div className='details'>
          <p>email</p>
          <h5 className='email'>{user?.email}</h5>
        </div>
        {!path.split('/').includes('admin') && (
          <div className='details'>
            <p>address book</p>
            <Link to={addressURL}>Update Address</Link>
          </div>
        )}
      </InfoWrapper>
    </TabContentWrapper>
  );
};

export default ProfileContent;
