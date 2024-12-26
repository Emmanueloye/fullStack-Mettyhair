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

const CategoryDetails = () => {
  const { id: categoryId } = useLoaderData() as { id: string };

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
        <h4>Category Details</h4>
        <Link to='/admin/categories'>Categories</Link>
      </AdminHeader>
      <TabContentWrapper $dark={true}>
        <Form>
          <AFormGroup>
            <Label htmlFor='category' type='dark'>
              category
            </Label>
            <Input
              id='category'
              $dark={true}
              type='text'
              defaultValue={category.category}
              disabled
              $capitalize={true}
            />
          </AFormGroup>
          <TwoGrid type='normal'>
            <AFormGroup>
              <Label htmlFor='createdBy' type='dark'>
                created by
              </Label>
              <Input
                id='createdBy'
                $dark={true}
                type='text'
                defaultValue={category?.createdBy?.fullName}
                disabled
                $capitalize={true}
              />
            </AFormGroup>
            <AFormGroup>
              <Label htmlFor='createdDate' type='dark'>
                created Date
              </Label>
              <Input
                id='createdDate'
                $dark={true}
                type='text'
                defaultValue={
                  category.createdAt && formatDate(new Date(category.createdAt))
                }
                disabled
                $capitalize={true}
              />
            </AFormGroup>
          </TwoGrid>
          <TwoGrid type='normal'>
            <AFormGroup>
              <Label htmlFor='editedBy' type='dark'>
                Last Edited by
              </Label>
              <Input
                id='editedBy'
                $dark={true}
                type='text'
                defaultValue={category?.updatedBy?.fullName}
                disabled
                $capitalize={true}
              />
            </AFormGroup>
            <AFormGroup>
              <Label htmlFor='editedDate' type='dark'>
                Last Edited Date
              </Label>
              <Input
                id='editedDate'
                $dark={true}
                type='text'
                defaultValue={
                  category.updatedAt && formatDate(new Date(category.updatedAt))
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

export default CategoryDetails;

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
