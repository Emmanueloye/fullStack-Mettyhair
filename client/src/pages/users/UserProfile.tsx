import ProfileContent from '../../features/Profile/ProfileContent';
import { useOutletContext } from 'react-router-dom';
import { User } from '../../dtos/userDto';
import { Helmet } from 'react-helmet-async';

const UserProfile = () => {
  const user = useOutletContext<User>();

  return (
    <>
      <Helmet>
        <title>MettyHair - Profile</title>
      </Helmet>
      <ProfileContent
        user={user}
        editURL='/user/profile/edit'
        addressURL='/user/profile/address-book'
      />
    </>
  );
};

export default UserProfile;
