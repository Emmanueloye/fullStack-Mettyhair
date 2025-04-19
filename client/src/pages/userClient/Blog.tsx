/* eslint-disable react-refresh/only-export-components */
import BlogCard from '../../features/blogComponents/BlogCard';
import BlogHero from '../../features/blogComponents/BlogHero';
import { Center } from '../../features/Tab/TabContentWrapper';
import Container from '../../ui/Container';
import FormBox from '../../features/navigationbar/SearchStyle';
import Pagination from '../../features/products/allProducts/Pagination';
import {
  extractParams,
  getData,
  getOnlyData,
  queryClient,
} from '../../api/requests';
import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BlogTypes } from '../../dtos/blogDto';
import { ThreeGrid } from '../../features/adminNavLayouts/AdminUtils';
import { useEffect, useState } from 'react';
import Empty from '../../ui/Empty';

const Blog = () => {
  const [allPosts, setAllPost] = useState<BlogTypes[]>([]);
  const { page, limit } = useLoaderData() as { page: number; limit: number };
  const { data } = useQuery({
    queryKey: ['fetchPost', 'posts', page ?? 1],
    queryFn: () =>
      getData({ url: `/posts?isActive=true&page=${page || 1}&limit=${limit}` }),
  });

  const { posts }: { posts: BlogTypes[] } = data;
  const { totalPages, currentPage, nextPage, previousPage } = data.page;

  useEffect(() => {
    setAllPost(posts);
  }, [posts]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeout(async () => {
      const resp = await getOnlyData({
        url: `/posts?search=title&value=${encodeURIComponent(e.target.value)}`,
      });
      setAllPost(resp.posts);
    }, 1000);
  };

  return (
    <div>
      {/* Hero */}
      <BlogHero />
      <Container id='blog'>
        {/* Search form */}
        <Center>
          <FormBox style={{ width: '80%', margin: '2rem 0' }}>
            <div>
              <div className='input-search'>
                <input
                  type='text'
                  placeholder='Search blog title...'
                  name='search'
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className='btn-box'></div>
          </FormBox>
        </Center>
        {allPosts.length > 0 ? (
          <ThreeGrid>
            {allPosts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </ThreeGrid>
        ) : (
          <Empty message='No blog post found' showLink={false} />
        )}

        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            nextPage={nextPage}
            previousPage={previousPage}
            pageLink='/blog'
          />
        )}
      </Container>
    </div>
  );
};

export default Blog;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const params = extractParams(request);

  const { page } = params;
  const limit = 6;
  await queryClient.ensureQueryData({
    queryKey: ['fetchPost', 'posts', page ?? 1],
    queryFn: () =>
      getData({ url: `/posts?isActive=true&page=${page || 1}&limit=${limit}` }),
  });

  return { ...params, limit };
};
