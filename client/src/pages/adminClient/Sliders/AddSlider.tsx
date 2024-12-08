/* eslint-disable react-refresh/only-export-components */
import {
  ActionFunctionArgs,
  Form,
  Link,
  useActionData,
} from 'react-router-dom';
import {
  AdminHeader,
  AdminSection,
  AFormGroup,
} from '../../../features/adminNavLayouts/AdminUtils';
import { TabContentWrapper } from '../../../features/Tab/TabContentWrapper';
import FormError from '../../../ui/FormError';
import Input from '../../../ui/Input';
import Button from '../../../ui/Button';
import { MdOutlineCreateNewFolder } from 'react-icons/md';
import { postData } from '../../../api/requests';
import { InfoType } from '../../../dtos/utilsDto';

const AddSlider = () => {
  const data = useActionData() as InfoType;
  return (
    <AdminSection>
      <AdminHeader>
        <h4>Add slider</h4>
        <Link to='/admin/sliders'>sliders</Link>
      </AdminHeader>
      <TabContentWrapper $dark={true}>
        <Form id='form' method='post' encType='multipart/form-data'>
          {data && <FormError info={data.message} />}

          <AFormGroup>
            <Input
              $dark={true}
              type='text'
              id='title'
              placeholder='slider title*'
              name='title'
            />
          </AFormGroup>
          <AFormGroup>
            <Input
              $dark={true}
              type='text'
              id='description'
              placeholder='slider description*'
              name='description'
            />
          </AFormGroup>
          <AFormGroup>
            <Input $dark={true} type='file' id='image' name='image' />
          </AFormGroup>
          <AFormGroup>
            <Button
              btnText='create slider'
              icon={<MdOutlineCreateNewFolder />}
            />
          </AFormGroup>
        </Form>
      </TabContentWrapper>
    </AdminSection>
  );
};

export default AddSlider;

export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await request.formData();
  return postData({
    url: '/sliders',
    data,
    redirectTo: '/admin/sliders',
    setToast: true,
    invalidate: ['fetchSlider'],
  });
};
