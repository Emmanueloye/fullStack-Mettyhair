import {
  Form,
  Link,
  LoaderFunctionArgs,
  useLoaderData,
} from 'react-router-dom';
import {
  AdminHeader,
  AdminSection,
  AFormGroup,
  TwoGrid,
} from '../../../features/adminNavLayouts/AdminUtils';
import { TabContentWrapper } from '../../../features/Tab/TabContentWrapper';
import Input, { Label } from '../../../ui/Input';
import { getData, queryClient } from '../../../api/requests';
import { useQuery } from '@tanstack/react-query';
import { formatDate } from '../../../utilities/HelperFunc';

const SubcategoryDetails = () => {
  const { id } = useLoaderData() as { id: string };
  const {
    data: { subcategory },
  } = useQuery({
    queryKey: ['subcategory', id],
    queryFn: () => getData({ url: `/subcategories/${id}` }),
  });

  return (
    <AdminSection>
      <AdminHeader>
        <h4>subcategory Details</h4>
        <Link to='/admin/subcategories'>subcategories</Link>
      </AdminHeader>
      <TabContentWrapper $dark={true}>
        <Form id='form'>
          <AFormGroup>
            <Label htmlFor='category'>category</Label>
            <Input
              id='category'
              $dark={true}
              type='text'
              defaultValue={subcategory.category.category}
              disabled
              $capitalize={true}
            />
          </AFormGroup>

          <AFormGroup>
            <Label htmlFor='subcategory'>subcategory</Label>
            <Input
              id='subcategory'
              $dark={true}
              type='text'
              defaultValue={subcategory.subcategory}
              disabled
              $capitalize={true}
            />
          </AFormGroup>
          <AFormGroup>
            <Label htmlFor='status'>status</Label>
            <Input
              id='status'
              $dark={true}
              type='text'
              defaultValue={subcategory.isActive ? 'Active' : 'Inactive'}
              disabled
              $capitalize={true}
            />
          </AFormGroup>
          <TwoGrid type='normal'>
            <AFormGroup>
              <Label htmlFor='createdby'>created by</Label>
              <Input
                id='createdby'
                $dark={true}
                type='text'
                defaultValue={subcategory.createdBy.fullName}
                disabled
                $capitalize={true}
              />
            </AFormGroup>
            <AFormGroup>
              <Label htmlFor='createdAt'>created Date</Label>
              <Input
                id='createdAt'
                $dark={true}
                type='text'
                defaultValue={
                  subcategory.createdAt &&
                  formatDate(new Date(subcategory.createdAt))
                }
                disabled
                $capitalize={true}
              />
            </AFormGroup>
          </TwoGrid>
          <TwoGrid type='normal'>
            <AFormGroup>
              <Label htmlFor='editedBy'>Last Edited by</Label>
              <Input
                id='editedBy'
                $dark={true}
                type='text'
                defaultValue={
                  subcategory.updatedBy && subcategory.updatedBy.fullName
                }
                disabled
                $capitalize={true}
              />
            </AFormGroup>
            <AFormGroup>
              <Label htmlFor='editedAt'>Last Edited Date</Label>
              <Input
                id='editedAt'
                $dark={true}
                type='text'
                defaultValue={
                  subcategory.updatedAt &&
                  formatDate(new Date(subcategory.updatedAt))
                }
                disabled
                $capitalize={true}
              />
            </AFormGroup>
          </TwoGrid>
        </Form>
      </TabContentWrapper>
    </AdminSection>
  );
};

export default SubcategoryDetails;

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;
  await queryClient.ensureQueryData({
    queryKey: ['subcategory', id],
    queryFn: () => getData({ url: `/subcategories/${id}` }),
  });
  return params;
};
