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
import { TabContentWrapper } from '../../../features/Tab/TabContentWrapper';
import { Select } from '../../../ui/SelectInput';
import Input, { Label } from '../../../ui/Input';
import Button from '../../../ui/Button';
import { GrUpdate } from 'react-icons/gr';
import {
  extractFormData,
  getData,
  queryClient,
  updateData,
} from '../../../api/requests';
import { useQuery } from '@tanstack/react-query';
import { CategoriesType } from '../../../dtos/categoriesDto';
import { InfoType } from '../../../dtos/utilsDto';
import FormError from '../../../ui/FormError';

const EditSubcategory = () => {
  const { id } = useLoaderData() as { id: string };
  const actionData = useActionData() as InfoType;

  const {
    data: { subcategory },
  } = useQuery({
    queryKey: ['subcategory', id],
    queryFn: () => getData({ url: `/subcategories/${id}` }),
  });

  const {
    data: { categories },
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getData({ url: `/categories` }),
  });

  return (
    <AdminSection>
      <AdminHeader>
        <h4>Update subcategory</h4>
        <Link to='/admin/subcategories'>subcategories</Link>
      </AdminHeader>
      <TabContentWrapper $dark={true}>
        <Form id='form' method='patch'>
          {actionData && <FormError info={actionData.message} />}
          <AFormGroup>
            <Label htmlFor='category'>Category</Label>
            <Select
              id='category'
              name='category'
              $width='100%'
              $bg='var(--admin-input-bg)'
            >
              <option value={subcategory.category._id}>
                {subcategory.category.category}
              </option>
              {categories
                .filter(
                  (item: CategoriesType) =>
                    item._id !== subcategory.category._id
                )
                .map((cat: CategoriesType) => (
                  <option value={cat._id} key={cat._id}>
                    {cat.category}
                  </option>
                ))}
            </Select>
          </AFormGroup>
          <AFormGroup>
            <Label htmlFor='subcategory'>subcategory</Label>
            <Input
              $dark={true}
              type='text'
              id='subcategory'
              placeholder='Subcateogry*'
              defaultValue={subcategory.subcategory}
              name='subcategory'
              $capitalize={true}
            />
          </AFormGroup>
          <AFormGroup>
            <Button btnText='Update subcategory' icon={<GrUpdate />} />
          </AFormGroup>
        </Form>
      </TabContentWrapper>
    </AdminSection>
  );
};

export default EditSubcategory;

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;
  await queryClient.ensureQueryData({
    queryKey: ['subcategory', id],
    queryFn: () => getData({ url: `/subcategories/${id}` }),
  });
  await queryClient.ensureQueryData({
    queryKey: ['categories'],
    queryFn: () => getData({ url: `/categories` }),
  });

  return params;
};

// eslint-disable-next-line react-refresh/only-export-components
export const action = async ({ request, params }: ActionFunctionArgs) => {
  const data = await extractFormData(request);

  const resp = await updateData({
    url: `/subcategories/${params.id}`,
    data,
    redirectTo: '/admin/subcategories',
    setToast: true,
  });
  queryClient.invalidateQueries({ queryKey: ['subcategory', params.id] });
  queryClient.invalidateQueries({ queryKey: ['categories'] });
  return resp;
};
