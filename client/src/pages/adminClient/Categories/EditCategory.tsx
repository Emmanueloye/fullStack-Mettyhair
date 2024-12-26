import {
  ActionFunctionArgs,
  Form,
  LoaderFunctionArgs,
  useActionData,
  useLoaderData,
} from 'react-router-dom';
import {
  AdminHeader,
  AdminSection,
  AFormGroup,
} from '../../../features/adminNavLayouts/AdminUtils';
import { TabContentWrapper } from '../../../features/Tab/TabContentWrapper';
import Input, { Label } from '../../../ui/Input';
import Button from '../../../ui/Button';
import { GrUpdate } from 'react-icons/gr';
import { Link } from 'react-router-dom';
import { getData, queryClient, updateData } from '../../../api/requests';
import { useQuery } from '@tanstack/react-query';
import FormError from '../../../ui/FormError';
import { InfoType } from '../../../dtos/utilsDto';

const EditCategory = () => {
  const { id: categoryId } = useLoaderData() as { id: string };
  const data = useActionData() as InfoType;
  const {
    data: { category },
  } = useQuery({
    queryKey: ['category', categoryId],
    queryFn: () =>
      getData({
        url: `/categories/${categoryId}`,
      }),
  });

  return (
    <AdminSection>
      <AdminHeader>
        <h4>Update Category</h4>
        <Link to='/admin/categories'>categories</Link>
      </AdminHeader>
      <TabContentWrapper $dark={true}>
        <Form method='patch' encType='multipart/form-data'>
          {data && <FormError info={data.message} />}
          <AFormGroup>
            <Label htmlFor='category' type='dark'>
              Category
            </Label>
            <Input
              id='category'
              $dark={true}
              type='text'
              placeholder='category'
              name='category'
              defaultValue={category.category}
              $capitalize={true}
            />
          </AFormGroup>
          <AFormGroup>
            <Label htmlFor='photo' type='dark'>
              Category Image
            </Label>
            <Input id='photo' $dark={true} type='file' name='photo' />
          </AFormGroup>
          <AFormGroup>
            <Button btnText='Update category' icon={<GrUpdate />} />
          </AFormGroup>
        </Form>
      </TabContentWrapper>
    </AdminSection>
  );
};

export default EditCategory;

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id: categoryId } = params;
  await queryClient.ensureQueryData({
    queryKey: ['category', categoryId],
    queryFn: () =>
      getData({
        url: `/categories/${categoryId}`,
      }),
  });

  return params;
};

// eslint-disable-next-line react-refresh/only-export-components
export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { id: categoryId } = params;
  const data = await request.formData();

  return updateData({
    url: `/categories/${categoryId}`,
    data,
    redirectTo: '/admin/categories',
    setToast: true,
    invalidate: ['category'],
  });
};
