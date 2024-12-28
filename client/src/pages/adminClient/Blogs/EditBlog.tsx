/* eslint-disable react-refresh/only-export-components */
import {
  ActionFunctionArgs,
  Form,
  Link,
  LoaderFunctionArgs,
  useActionData,
  useLoaderData,
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
import { getData, queryClient, updateData } from '../../../api/requests';
import { useQuery } from '@tanstack/react-query';
import { InfoType } from '../../../dtos/utilsDto';
import FormError from '../../../ui/FormError';

const EditBlog = () => {
  const info = useActionData() as InfoType;
  const params = useLoaderData() as { id: string };
  const {
    data: { post },
  } = useQuery({
    queryKey: ['fetchPost', 'editPost', params.id],
    queryFn: () =>
      getData({
        url: `/posts/${params.id}`,
      }),
  });

  return (
    <AdminSection>
      <AdminHeader>
        <h4>Update Post</h4>
        <Link to='/admin/blogs'>Back to posts</Link>
      </AdminHeader>
      <Form method='post' encType='multipart/form-data'>
        {info && <FormError info={info.message} />}
        <AFormGroup>
          <Label htmlFor='title' type='dark'>
            title
          </Label>
          <Input
            id='title'
            type='text'
            $dark
            name='title'
            defaultValue={post.title}
          />
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
            defaultValue={post.content}
          ></TextArea>
        </AFormGroup>
        <AFormGroup>
          <Button btnText='add post' icon={<FaSave />} />
        </AFormGroup>
      </Form>
    </AdminSection>
  );
};

export default EditBlog;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  await queryClient.ensureQueryData({
    queryKey: ['fetchPost', 'editPost', params.id],
    queryFn: () =>
      getData({
        url: `/posts/${params.id}`,
      }),
  });

  return params;
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const data = await request.formData();
  return updateData({
    url: `/posts/${params.id}`,
    data,
    invalidate: ['fetchPost'],
    redirectTo: '/admin/blogs',
    setToast: true,
  });
};
