import styled from 'styled-components';
import { TabContentWrapper } from '../../features/Tab/TabContentWrapper';
import {
  ActionFunctionArgs,
  Form,
  useActionData,
  useNavigation,
  useOutletContext,
} from 'react-router-dom';
import InputGroup from '../../features/authComponent/InputGroup';
import { FaImage, FaUserAlt } from 'react-icons/fa';
import { MdMail } from 'react-icons/md';
import Button from '../../ui/Button';
import { GrDocumentUpdate } from 'react-icons/gr';
import { User } from '../../dtos/userDto';
import { updateData } from '../../api/requests';
import FormError from '../../ui/FormError';
import { InfoType } from '../../dtos/utilsDto';
import { Helmet } from 'react-helmet-async';

export const EditProfileWrapper = styled.div`
  form {
    margin: 0 auto;
  }

  @media screen and (min-width: 768px) {
    form {
      width: 70%;
    }
  }
  @media screen and (min-width: 1024px) {
    form {
      width: 50%;
    }
  }
`;

export const ProfileHeader = styled.h4`
  text-transform: uppercase;
  text-align: center;
  border-bottom: 2px solid var(--primary-color);
  border-left: 2px solid var(--primary-color);
  border-right: 2px solid var(--primary-color);
  border-radius: var(--rounded);
  margin-bottom: 2rem;
  padding: 2rem 0;
`;

const EditProfile = () => {
  const data = useActionData() as InfoType;
  const user = useOutletContext<User>();
  const { state } = useNavigation();
  return (
    <>
      <Helmet>
        <title>MettyHair - Update Profile</title>
      </Helmet>
      <EditProfileWrapper>
        <TabContentWrapper>
          <ProfileHeader>Update profile</ProfileHeader>
          <Form id='form' method='patch' encType='multipart/form-data'>
            {data && <FormError info={data.message} />}
            <InputGroup
              type='text'
              name='fullName'
              placeholder='Full name*'
              icon={<FaUserAlt />}
              defaultValue={user.fullName}
              mb='2rem'
              capitalize={true}
            />
            <InputGroup
              type='email'
              name='email'
              placeholder='email*'
              icon={<MdMail />}
              disabled={true}
              defaultValue={user.email}
              mb='2rem'
            />
            {/* <label htmlFor='image'>Choose file</label> */}
            <InputGroup
              type='file'
              name='photo'
              placeholder=''
              icon={<FaImage />}
              mb='2rem'
            />
            <div className='mt-3'>
              <Button
                btnText={
                  state === 'submitting' ? 'Updating...' : 'Update profile'
                }
                icon={<GrDocumentUpdate />}
              />
            </div>
          </Form>
        </TabContentWrapper>
      </EditProfileWrapper>
    </>
  );
};

export default EditProfile;

// eslint-disable-next-line react-refresh/only-export-components
export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await request.formData();
  return updateData({
    url: '/users/me',
    data,
    redirectTo: '/user/profile',
    setToast: true,
    invalidate: ['user'],
  });
};
