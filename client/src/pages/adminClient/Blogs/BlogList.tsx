/* eslint-disable react-refresh/only-export-components */
import {
  ActionFunctionArgs,
  Link,
  LoaderFunctionArgs,
  useLoaderData,
  useSearchParams,
} from 'react-router-dom';
import {
  AdminBox,
  AdminHeader,
  AdminSection,
  Status,
} from '../../../features/adminNavLayouts/AdminUtils';
import AppTableSearch from '../../../ui/AppTableSearch';
import { Table, TableRow } from '../../../ui/Table';
import { FaCheck, FaTimes } from 'react-icons/fa';
import ActionsBtns from '../../../features/adminActions/ActionsBtns';
import Pagination from '../../../features/products/allProducts/Pagination';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { BlogTypes } from '../../../dtos/blogDto';
import { useEffect, useState } from 'react';
import {
  deleteData,
  extractFormData,
  extractParams,
  getData,
  queryClient,
  updateData,
} from '../../../api/requests';
import { sortParamsSetting } from '../../../utilities/productSorting';
import Empty from '../../../ui/Empty';
import { formatDate } from '../../../utilities/HelperFunc';

const BlogList = () => {
  const queryClientHook = useQueryClient();
  const [allBlogs, setAllBlogs] = useState<BlogTypes[]>([]);
  const [searchField, setSearchField] = useState('title');
  const [searchValue, setSearchValue] = useState('');
  const { page, sort } = useLoaderData() as { page: number; sort: string };
  const [sortParams, setSortParams] = useSearchParams();

  const { data } = useQuery({
    queryKey: ['fetchPost', 'posts', page ?? 1, sort ?? '-createdAt'],
    queryFn: () =>
      getData({
        url: `/posts?page=${page || 1}&sort=${sort || '-createdAt'}`,
      }),
  });

  const { posts }: { posts: BlogTypes[] } = data || {};

  const { totalPages, currentPage, nextPage, previousPage } = data.page;

  useEffect(() => {
    setAllBlogs(posts);
  }, [posts]);

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortValue = sortParamsSetting(e);

    sortParams.set('sort', sortValue as string);
    setSortParams(sortParams);
  };

  const handleSearchField = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchField(e.target.value);
  };

  // get users based on the searchfield set in setSearch and the keyword typed into the search value input field.
  const handleSearchValue = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    let timeOut: number | undefined;
    const filterData = async () => {
      let newUrl = `/posts?search=${searchField}&value=${searchValue}`;
      if (searchField !== 'productName') {
        newUrl = `/posts?${searchField}=${searchValue}`;
      }
      timeOut = setTimeout(async () => {
        const resp = queryClientHook.fetchQuery({
          queryKey: ['fetchPost', 'post', searchValue],
          queryFn: () => getData({ url: newUrl }),
        });

        const data = await resp;

        if (searchValue) {
          setAllBlogs(data.posts);
        } else {
          setAllBlogs(posts);
        }
      }, 1000);
    };

    filterData();
    return () => {
      clearTimeout(timeOut);
    };
  }, [posts, searchValue]);

  // Table config
  const headers = ['image', 'title', 'created date', 'status', 'action'];
  const column = '0.6fr 1.8fr .8fr .5fr 1fr .4fr';
  return (
    <AdminSection>
      {/* Header */}
      <AdminHeader>
        <h4>Manage blogs</h4>
        <Link to='/admin/blogs/add'>New blog</Link>
      </AdminHeader>
      {/* Table search */}
      <AppTableSearch
        searchOptions={['title']}
        sortOptions={['old to new', 'new to old']}
        dark={true}
        bg='var(--admin-input-bg)'
        onSort={handleSort}
        onSearchField={handleSearchField}
        onSearchValue={handleSearchValue}
      />
      {/* Table */}
      <AdminBox>
        {allBlogs?.length > 0 ? (
          <>
            <Table headers={headers} column={column}>
              {allBlogs.map((post) => {
                const title =
                  post.title.length <= 37 ? post.title : `${post.title}...`;
                return (
                  <TableRow $column={column} key={post._id}>
                    <img
                      src={post?.image}
                      alt={post?.title}
                      width={40}
                      height={40}
                      className='rounded-img'
                    />
                    <p>{title}</p>
                    <p>
                      {post.createdAt && formatDate(new Date(post.createdAt))}
                    </p>

                    <p>
                      {post?.isActive ? (
                        <Status $isActive={post?.isActive}>
                          <FaCheck />
                        </Status>
                      ) : (
                        <Status>
                          <FaTimes />
                        </Status>
                      )}
                    </p>

                    <ActionsBtns
                      showActivation={true}
                      editURL={`/admin/blogs/edit/${post._id}`}
                      viewURL={`/admin/blogs/view/${post._id}`}
                      isActive={post.isActive}
                      id={post._id}
                    />
                  </TableRow>
                );
              })}
            </Table>

            {totalPages > 1 && (
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                nextPage={nextPage}
                previousPage={previousPage}
                pageLink='/admin/blogs'
                marginTop='2rem'
              />
            )}
          </>
        ) : (
          <Empty
            message={'No post is not available'}
            showLink={false}
            type='dark'
          />
        )}
      </AdminBox>
    </AdminSection>
  );
};

export default BlogList;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const params = extractParams(request);
  const { page, sort } = params;
  await queryClient.ensureQueryData({
    queryKey: ['fetchPost', 'posts', page ?? 1, sort ?? '-createdAt'],
    queryFn: () =>
      getData({
        url: `/posts?page=${page || 1}&sort=${sort || '-createdAt'}`,
      }),
  });

  return params;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { id, ...data } = await extractFormData(request);
  if (request.method === 'PATCH') {
    return updateData({
      url: `/posts/${id}`,
      data,
      // redirectTo: '/admin/products',
      setToast: true,
      invalidate: ['fetchPost'],
    });
  }

  if (request.method === 'DELETE') {
    return deleteData({
      url: `/posts/${id}`,
      //   redirectTo: '/admin/products',
      invalidate: ['fetchPost'],
    });
  }
};
