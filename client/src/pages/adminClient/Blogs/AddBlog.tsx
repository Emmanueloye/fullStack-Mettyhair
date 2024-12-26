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
import Input, { Label } from '../../../ui/Input';
import TextArea from '../../../ui/TextArea';
import Button from '../../../ui/Button';
import { FaSave } from 'react-icons/fa';
import { postData } from '../../../api/requests';
import { InfoType } from '../../../dtos/utilsDto';
import FormError from '../../../ui/FormError';

const AddBlog = () => {
  const info = useActionData() as InfoType;
  return (
    <AdminSection>
      <AdminHeader>
        <h4>New Post</h4>
        <Link to='/admin/blogs'>Back to posts</Link>
      </AdminHeader>
      <Form method='post' encType='multipart/form-data'>
        {info && <FormError info={info.message} />}
        <AFormGroup>
          <Label htmlFor='title' type='dark'>
            title
          </Label>
          <Input id='title' type='text' $dark name='title' />
        </AFormGroup>
        <AFormGroup>
          <Label htmlFor='image' type='dark'>
            image
          </Label>
          <Input id='image' type='file' $dark name='image' />
        </AFormGroup>
        <AFormGroup>
          <Label htmlFor='content' type='dark'>
            post
          </Label>
          <TextArea
            id='content'
            name='content'
            rows={10}
            cols={10}
            $dark
          ></TextArea>
        </AFormGroup>
        <AFormGroup>
          <Button btnText='add post' icon={<FaSave />} />
        </AFormGroup>
      </Form>
    </AdminSection>
  );
};

export default AddBlog;

export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await request.formData();
  return postData({
    url: '/posts',
    data,
    setToast: true,
    invalidate: ['fetchPost'],
    redirectTo: '/admin/blogs',
  });
};
