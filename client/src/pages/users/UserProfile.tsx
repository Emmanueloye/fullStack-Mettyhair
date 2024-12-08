import ProfileContent from '../../features/Profile/ProfileContent';
import { useOutletContext } from 'react-router-dom';
import { User } from '../../dtos/userDto';

const UserProfile = () => {
  const user = useOutletContext<User>();

  return (
    <ProfileContent
      user={user}
      editURL='/user/profile/edit'
      addressURL='/user/profile/address-book'
    />
  );
};

export default UserProfile;
