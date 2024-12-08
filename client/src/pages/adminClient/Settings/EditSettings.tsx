import { ActionFunctionArgs, Form } from 'react-router-dom';
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
import { extractFormData, postData } from '../../../api/requests';

const EditSetting = () => {
  return (
    <AdminSection>
      <AdminHeader>
        <h4>Site settings</h4>
      </AdminHeader>
      <TabContentWrapper $dark={true}>
        <Form id='form'>
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
                placeholder='Facebook'
                $dark={true}
                name='facebook'
              />
            </AFormGroup>
            <AFormGroup>
              <Label htmlFor='instagram'>instagram link*</Label>
              <Input
                type='text'
                id='instagram'
                placeholder='Instagram'
                $dark={true}
                name='instagram'
              />
            </AFormGroup>
            <AFormGroup>
              <Label htmlFor='thread'>thread link</Label>
              <Input
                type='text'
                id='thread'
                placeholder='Thread'
                $dark={true}
                name='thread'
              />
            </AFormGroup>
            <AFormGroup>
              <Label htmlFor='twitter'>twitter link</Label>
              <Input
                type='text'
                id='twitter'
                placeholder='Twitter'
                $dark={true}
                name='twitter'
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
                placeholder='Re-order level'
                $dark={true}
                name='reorderLevel'
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
                placeholder='Phone'
                $dark={true}
                name='contactPhone'
              />
            </AFormGroup>
            <AFormGroup>
              <Label htmlFor='email'>Email*</Label>
              <Input
                type='text'
                id='email'
                placeholder='Email'
                $dark={true}
                name='contactEmail'
              />
            </AFormGroup>
          </TwoGrid>
          <Button btnText='save settings' icon={<FaSave />} />
        </Form>
      </TabContentWrapper>
    </AdminSection>
  );
};

export default EditSetting;

export const loader = async () => {
  // return await
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await extractFormData(request);
  return postData({ url: `/settings`, data, setToast: true });
};
