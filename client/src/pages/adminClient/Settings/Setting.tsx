/* eslint-disable react-refresh/only-export-components */
import {
  ActionFunctionArgs,
  Form,
  json,
  useOutletContext,
} from 'react-router-dom';
import {
  AdminBox,
  AdminHeader,
  AdminSection,
  AFormGroup,
  TwoGrid,
} from '../../../features/adminNavLayouts/AdminUtils';
import {
  Center,
  TabContentWrapper,
} from '../../../features/Tab/TabContentWrapper';
import Input, { Label } from '../../../ui/Input';
import Button from '../../../ui/Button';
import { FaSave } from 'react-icons/fa';
import {
  extractFormData,
  getData,
  queryClient,
  updateData,
} from '../../../api/requests';
import { useQuery } from '@tanstack/react-query';
import { User } from '../../../dtos/userDto';
import { useEffect } from 'react';

const Setting = () => {
  const user = useOutletContext() as User;

  useEffect(() => {
    if (!user.role.startsWith('super')) {
      throw json({ message: 'Page not found.' });
    }
  }, [user.role]);

  const {
    data: { settings },
  } = useQuery({
    queryKey: ['setting'],
    queryFn: () => getData({ url: '/settings' }),
  });

  const currSetting = settings[0];

  return (
    <AdminSection>
      <AdminHeader>
        <h4>Site settings</h4>
      </AdminHeader>
      <TabContentWrapper $dark={true}>
        <Form id='form' method='patch'>
          {/* Social media settings */}
          <Center>
            <AdminBox>
              <h4>Social Media</h4>
            </AdminBox>
          </Center>
          <TwoGrid>
            <AFormGroup>
              <Label htmlFor='facebook'>Facebook link*</Label>
              <Input
                type='text'
                id='facebook'
                $dark={true}
                name='facebook'
                defaultValue={currSetting.facebook}
                autoComplete='off'
              />
            </AFormGroup>
            <AFormGroup>
              <Label htmlFor='instagram'>instagram link*</Label>
              <Input
                type='text'
                id='instagram'
                $dark={true}
                name='instagram'
                defaultValue={currSetting.instagram}
                autoComplete='off'
              />
            </AFormGroup>
            <AFormGroup>
              <Label htmlFor='thread'>thread link</Label>
              <Input
                type='text'
                id='thread'
                $dark={true}
                name='thread'
                defaultValue={currSetting.thread}
                autoComplete='off'
              />
            </AFormGroup>
            <AFormGroup>
              <Label htmlFor='twitter'>twitter link</Label>
              <Input
                type='text'
                id='twitter'
                $dark={true}
                name='twitter'
                defaultValue={currSetting.twitter}
                autoComplete='off'
              />
            </AFormGroup>
          </TwoGrid>
          <Center>
            {/* Inventory settings */}
            <AdminBox>
              <h4>Inventory</h4>
            </AdminBox>
          </Center>
          <TwoGrid>
            <AFormGroup>
              <Label htmlFor='orderLevel'>Re-order level*</Label>
              <Input
                type='text'
                id='orderLevel'
                $dark={true}
                name='reorderLevel'
                defaultValue={currSetting.reorderLevel}
                autoComplete='off'
              />
            </AFormGroup>
          </TwoGrid>
          <Center>
            <AdminBox>
              <h4>Contact</h4>
            </AdminBox>
          </Center>
          <TwoGrid>
            <AFormGroup>
              <Label htmlFor='phone'>Phone number*</Label>
              <Input
                type='text'
                id='phone'
                $dark={true}
                name='contactPhone'
                defaultValue={currSetting.contactPhone}
                autoComplete='off'
              />
            </AFormGroup>
            <AFormGroup>
              <Label htmlFor='email'>Email*</Label>
              <Input
                type='text'
                id='email'
                $dark={true}
                name='contactEmail'
                defaultValue={currSetting.contactEmail}
                autoComplete='off'
              />
            </AFormGroup>
          </TwoGrid>
          <input type='hidden' name='id' defaultValue={currSetting._id} />
          <Button btnText='save settings' icon={<FaSave />} />
        </Form>
      </TabContentWrapper>
    </AdminSection>
  );
};

export default Setting;

export const loader = async () => {
  return queryClient.ensureQueryData({
    queryKey: ['setting'],
    queryFn: () => getData({ url: '/settings' }),
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { id, ...data } = await extractFormData(request);
  return updateData({
    url: `/settings/${id}`,
    data,
    setToast: true,
    invalidate: ['setting'],
  });
};
