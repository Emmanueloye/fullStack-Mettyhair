import { useOutletContext } from 'react-router-dom';
// import { user } from '../../data/ProductData';
import {
  AdminHeader,
  AdminSection,
} from '../../features/adminNavLayouts/AdminUtils';
import ProfileContent from '../../features/Profile/ProfileContent';
import { User } from '../../dtos/userDto';
import { Helmet } from 'react-helmet-async';

const AdminProfile = () => {
  const user = useOutletContext<User>();
  return (
    <>
      <Helmet>
        <title>MettyHair - Profile</title>
      </Helmet>
      <AdminSection>
        <AdminHeader>
          <h4>{`${user.fullName.split(' ')[0]}'s`} profile</h4>
        </AdminHeader>
        <ProfileContent
          user={user}
          editURL='/admin/profile/edit'
          addressURL=''
          isDark={true}
        />
      </AdminSection>
    </>
  );
};
export default AdminProfile;
