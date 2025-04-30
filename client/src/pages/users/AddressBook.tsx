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
import { FaFlag, FaMapMarker, FaPhone } from 'react-icons/fa';
import { FaHouse } from 'react-icons/fa6';
import Button from '../../ui/Button';
import { GrDocumentUpdate } from 'react-icons/gr';
import { User } from '../../dtos/userDto';
import { extractFormData, updateData } from '../../api/requests';
import { Label } from '../../ui/Input';
import { AFormGroup } from '../../features/adminNavLayouts/AdminUtils';
import { InfoType } from '../../dtos/utilsDto';
import FormError from '../../ui/FormError';
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

const AddressBook = () => {
  const user = useOutletContext<User>();
  const error = useActionData() as InfoType;
  const { state } = useNavigation();
  return (
    <>
      <Helmet>
        <title>MettyHair - Address book</title>
      </Helmet>
      <EditProfileWrapper>
        <TabContentWrapper>
          <ProfileHeader>Address Book</ProfileHeader>
          <Form id='form' method='patch'>
            {error && <FormError info={error.message} />}
            <AFormGroup>
              <Label htmlFor='address'>Address*</Label>
              <InputGroup
                type='text'
                name='address'
                icon={<FaMapMarker />}
                defaultValue={user.address}
                mb='2rem'
                capitalize={true}
              />
            </AFormGroup>
            <AFormGroup>
              <Label htmlFor='phone'>phone*</Label>
              <InputGroup
                type='text'
                name='phone'
                icon={<FaPhone />}
                defaultValue={user.phone}
                mb='2rem'
                capitalize={true}
              />
            </AFormGroup>
            <AFormGroup>
              <Label htmlFor='address'>state*</Label>
              <InputGroup
                type='text'
                name='state'
                icon={<FaHouse />}
                defaultValue={user.state}
                mb='2rem'
                capitalize={true}
              />
            </AFormGroup>
            {/* <label htmlFor='image'>Choose file</label> */}
            <AFormGroup>
              <Label htmlFor='country'>Country*</Label>
              <InputGroup
                type='text'
                name='country'
                icon={<FaFlag />}
                defaultValue={user.country}
                mb='2rem'
                capitalize={true}
              />
            </AFormGroup>
            <div className='mt-3'>
              <Button
                btnText={
                  state === 'submitting' ? 'Updating...' : 'Update Address Book'
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

export default AddressBook;

// eslint-disable-next-line react-refresh/only-export-components
export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await extractFormData(request);
  return updateData({
    url: '/users/update-address',
    data,
    redirectTo: '/user/profile',
    setToast: true,
    invalidate: ['user'],
  });
};
