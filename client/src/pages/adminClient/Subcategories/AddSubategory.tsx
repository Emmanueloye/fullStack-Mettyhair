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
import Input from '../../../ui/Input';
import Button from '../../../ui/Button';
import { MdOutlineCreateNewFolder } from 'react-icons/md';
import { Select } from '../../../ui/SelectInput';
import {
  extractFormData,
  getData,
  postData,
  queryClient,
} from '../../../api/requests';
import { CategoriesType } from '../../../dtos/categoriesDto';
import { useQuery } from '@tanstack/react-query';
import FormError from '../../../ui/FormError';
import { InfoType } from '../../../dtos/utilsDto';

const AddSubcategory = () => {
  const data = useActionData() as InfoType;
  const {
    data: { categories },
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () =>
      getData({
        url: `/categories`,
      }),
  });

  return (
    <AdminSection>
      <AdminHeader>
        <h4>Add Subcategory</h4>
        <Link to='/admin/subcategories'>subcategories</Link>
      </AdminHeader>
      <TabContentWrapper $dark={true}>
        <Form id='form' method='post'>
          {data && <FormError info={data.message} />}
          <AFormGroup>
            <Select name='category' $width='100%' $bg='var(--admin-input-bg)'>
              <option value='' hidden>
                Select Category*
              </option>
              {categories.map((item: CategoriesType) => (
                <option value={item._id} key={item._id}>
                  {item.category}
                </option>
              ))}
            </Select>
          </AFormGroup>
          <Input
            $dark={true}
            type='text'
            id='subcategory'
            placeholder='Subcateogry*'
            name='subcategory'
          />
          <AFormGroup>
            <Button
              btnText='create subcategory'
              icon={<MdOutlineCreateNewFolder />}
            />
          </AFormGroup>
        </Form>
      </TabContentWrapper>
    </AdminSection>
  );
};

export default AddSubcategory;

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async () => {
  return queryClient.ensureQueryData({
    queryKey: ['categories'],
    queryFn: () =>
      getData({
        url: `/categories`,
      }),
  });
};

// eslint-disable-next-line react-refresh/only-export-components
export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await extractFormData(request);
  return postData({
    url: '/subcategories',
    data,
    redirectTo: '/admin/subcategories',
    setToast: true,
    invalidate: ['subcategories'],
  });
};
