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
import Input from '../../../ui/Input';
import { TabContentWrapper } from '../../../features/Tab/TabContentWrapper';
import Button from '../../../ui/Button';
import { MdOutlineCreateNewFolder } from 'react-icons/md';
import { postData } from '../../../api/requests';
import { InfoType } from '../../../dtos/utilsDto';
import FormError from '../../../ui/FormError';

const AddCategory = () => {
  const data = useActionData() as InfoType;

  return (
    <AdminSection>
      <AdminHeader>
        <h4>Add Category</h4>
        <Link to='/admin/categories'>Categories</Link>
      </AdminHeader>
      <TabContentWrapper $dark={true}>
        <Form method='post' encType='multipart/form-data'>
          {data && <FormError info={data.message} />}
          <AFormGroup>
            <Input
              $dark={true}
              type='text'
              id='category'
              placeholder='category*'
              name='category'
            />
          </AFormGroup>
          <AFormGroup>
            <Input $dark={true} type='file' id='photo' name='photo' />
          </AFormGroup>
          <AFormGroup>
            <Button
              btnText='create category'
              icon={<MdOutlineCreateNewFolder />}
            />
          </AFormGroup>
        </Form>
      </TabContentWrapper>
    </AdminSection>
  );
};

export default AddCategory;

// eslint-disable-next-line react-refresh/only-export-components
export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await request.formData();
  return postData({
    url: '/categories',
    data,
    redirectTo: '/admin/categories',
    setToast: true,
    invalidate: ['categories'],
  });
};
