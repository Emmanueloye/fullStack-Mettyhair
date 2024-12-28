/* eslint-disable react-refresh/only-export-components */
import {
  AdminHeader,
  AdminSection,
  AFormGroup,
  TwoGrid,
} from '../../../features/adminNavLayouts/AdminUtils';
import { BlogDetailsBox } from '../../userClient/BlogDetails';
import Container from '../../../ui/Container';
import { Link, LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
import { getData, queryClient } from '../../../api/requests';
import { useQuery } from '@tanstack/react-query';
import { formatDate } from '../../../utilities/HelperFunc';
import Input, { Label } from '../../../ui/Input';

const AdminBlogView = () => {
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
        <h4>Blog Details</h4>
        <Link to='/admin/blogs'>Back to blogs</Link>
      </AdminHeader>
      <BlogDetailsBox>
        <Container>
          <img src={post.image} alt={post.title} className='img' />
          <div className='main admin-color'>
            <h3 className='title'>{post.title}</h3>

            <div className='small'>
              <span>Created Date: </span>
              <span>
                {post.createdAt && formatDate(new Date(post.createdAt))}
              </span>
            </div>
            <div className='preserve-whitespace'>{post.content}</div>
          </div>
          <TwoGrid>
            <AFormGroup>
              <Label htmlFor='createdBy' type='dark'>
                created by
              </Label>
              <Input
                id='createdBy'
                defaultValue={post.createdBy.fullName}
                $dark
                disabled
                $capitalize
              />
            </AFormGroup>
            <AFormGroup>
              <Label htmlFor='createdDate' type='dark'>
                created date
              </Label>
              <Input
                id='createdBy'
                defaultValue={
                  post.createdAt && formatDate(new Date(post.createdAt))
                }
                $dark
                disabled
                $capitalize
              />
            </AFormGroup>
            <AFormGroup>
              <Label htmlFor='updatedBy' type='dark'>
                updated by
              </Label>
              <Input
                id='updatedBy'
                defaultValue={post.updatedBy?.fullName}
                $dark
                disabled
                $capitalize
              />
            </AFormGroup>
            <AFormGroup>
              <Label htmlFor='updatedDate' type='dark'>
                updated date
              </Label>
              <Input
                id='updatedBy'
                defaultValue={
                  post.updatedAt && formatDate(new Date(post.updatedAt))
                }
                $dark
                disabled
                $capitalize
              />
            </AFormGroup>
          </TwoGrid>
        </Container>
      </BlogDetailsBox>
    </AdminSection>
  );
};

export default AdminBlogView;

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
