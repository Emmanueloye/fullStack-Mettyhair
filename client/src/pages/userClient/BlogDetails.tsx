import styled from 'styled-components';
import Container from '../../ui/Container';
import LinkBtn from '../../ui/LinkBtn';
import { getData, queryClient } from '../../api/requests';
import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { formatDate } from '../../utilities/HelperFunc';

export const BlogDetailsBox = styled.div`
  padding-top: 4rem;
  .img {
    width: 30rem;
    height: 30rem;
    float: left;
    margin-right: 2rem;
    object-fit: fill;
  }
  .title {
    color: var(--main-red-600);
    text-transform: capitalize;
  }
  .small {
    font-weight: 500;
    margin-bottom: 2rem;
    span:first-child {
      font-weight: 600;
    }
  }
`;

const BlogDetails = () => {
  const params = useLoaderData() as { id: string };

  const {
    data: { post },
  } = useQuery({
    queryKey: ['fetchPost', 'posts', params.id],
    queryFn: () => getData({ url: `/posts/${params.id}` }),
  });

  // console.log(data);

  return (
    <BlogDetailsBox>
      <Container>
        <img src={post.image} alt='blog image' className='img' />
        <div className='main'>
          <h3 className='title'>{post.title}</h3>

          <div className='small'>
            <span>Created Date: </span>
            <span>
              {post.createdAt && formatDate(new Date(post.createdAt))}
            </span>
          </div>
          <div className='preserve-whitespace'> {post.content}</div>
        </div>
        <LinkBtn btnText='back to main blog' url='/blog' />
      </Container>
    </BlogDetailsBox>
  );
};

export default BlogDetails;

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async ({ params }: LoaderFunctionArgs) => {
  await queryClient.ensureQueryData({
    queryKey: ['fetchPost', 'posts', params.id],
    queryFn: () => getData({ url: `/posts/${params.id}` }),
  });

  return params;
};
