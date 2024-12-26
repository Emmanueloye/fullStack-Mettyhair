import { IoSearch } from 'react-icons/io5';
import BlogCard from '../../features/blogComponents/BlogCard';
import BlogHero from '../../features/blogComponents/BlogHero';
import { Center } from '../../features/Tab/TabContentWrapper';
import Container from '../../ui/Container';
import Icon from '../../ui/Icon';
import FormBox from '../../features/navigationbar/SearchStyle';
import styled from 'styled-components';
import Pagination from '../../features/products/allProducts/Pagination';

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  @media screen and (min-width: 500px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media screen and (min-width: 736px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media screen and (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const Blog = () => {
  return (
    <div>
      {/* Hero */}
      <BlogHero />
      <Container id='blog'>
        {/* Search form */}
        <Center>
          <FormBox style={{ width: '80%', margin: '2rem 0' }}>
            <form>
              <div className='input-search'>
                <input
                  type='text'
                  placeholder='Search blog title...'
                  name='search'
                />
                <button type='submit' className='btn'>
                  <Icon
                    icon={<IoSearch />}
                    iconSize='2.5rem'
                    color='var(--primary-color)'
                  />
                </button>
              </div>
            </form>
            <div className='btn-box'></div>
          </FormBox>
        </Center>
        <Grid>
          <BlogCard />
          <BlogCard />
          <BlogCard />
          <BlogCard />
          <BlogCard />
          <BlogCard />
          <BlogCard />
          <BlogCard />
        </Grid>
        <Pagination
          totalPages={1}
          currentPage={1}
          nextPage={1}
          previousPage={1}
          pageLink='/'
        />
      </Container>
    </div>
  );
};

export default Blog;
