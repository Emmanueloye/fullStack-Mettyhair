/* eslint-disable react-refresh/only-export-components */
import {
  AdminHeader,
  AdminSection,
} from '../../../features/adminNavLayouts/AdminUtils';
import { BlogDetailsBox } from '../../userClient/BlogDetails';
import Container from '../../../ui/Container';
import { Link, LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
import { getData, queryClient } from '../../../api/requests';
import { useQuery } from '@tanstack/react-query';
import { formatDate } from '../../../utilities/HelperFunc';

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

            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos
              optio, perspiciatis dicta accusantium quod libero necessitatibus
              officia temporibus delectus voluptates. Consequatur, amet sit id
              enim aspernatur, dolorem illum ab quod aliquid laborum placeat
              cumque ad. Perferendis qui tempore illo quod doloribus dolore
              ducimus consequuntur corporis ipsum inventore voluptatum
              architecto magnam ex mollitia eaque est quidem nulla
              necessitatibus numquam, molestiae excepturi?
            </p>
            <br />
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos
              optio, perspiciatis dicta accusantium quod libero necessitatibus
              officia temporibus delectus voluptates. Consequatur, amet sit id
              enim aspernatur, dolorem illum ab quod aliquid laborum placeat
              cumque ad. Perferendis qui tempore illo quod doloribus dolore
              ducimus consequuntur corporis ipsum inventore voluptatum
              architecto magnam ex mollitia eaque est quidem nulla
              necessitatibus numquam, molestiae excepturi?
            </p>
            <br />
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos
              optio, perspiciatis dicta accusantium quod libero necessitatibus
              officia temporibus delectus voluptates. Consequatur, amet sit id
              enim aspernatur, dolorem illum ab quod aliquid laborum placeat
              cumque ad. Perferendis qui tempore illo quod doloribus dolore
              ducimus consequuntur corporis ipsum inventore voluptatum
              architecto magnam ex mollitia eaque est quidem nulla
              necessitatibus numquam, molestiae excepturi?
            </p>
          </div>
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
