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
} from '../../../features/adminNavLayouts/AdminUtils';
import { Table, TableRow } from '../../../ui/Table';
import ActionsBtns from '../../../features/adminActions/ActionsBtns';
import Empty from '../../../ui/Empty';
import Pagination from '../../../features/products/allProducts/Pagination';
import AppTableSearch from '../../../ui/AppTableSearch';
import {
  deleteData,
  extractFormData,
  extractParams,
  getData,
  queryClient,
} from '../../../api/requests';
import { useQuery } from '@tanstack/react-query';
import { CategoriesType } from '../../../dtos/categoriesDto';
import { formatDate } from '../../../utilities/HelperFunc';
import { useEffect, useState } from 'react';
import { DEFAULT_USER_IMG } from '../../../utilities/constant';

const Category = () => {
  const [allCategories, setAllCategories] = useState<CategoriesType[]>([]);
  const [searchField, setSearchField] = useState('category');
  const { page, sort } = useLoaderData() as { page: number; sort: string };
  const [sortParams, setSortParams] = useSearchParams();

  // Table config
  const headers = ['S/N', 'Sections', 'Created Date', 'action'];
  const column = '1fr 1fr 1fr 1.5fr';

  const { data } = useQuery({
    queryKey: ['categories', page ?? 1, sort ?? '-createdAt'],
    queryFn: () =>
      getData({
        url: `/categories?page=${page || 1}&sort=${sort || '-createdAt'}`,
      }),
  });

  const { categories }: { categories: CategoriesType[] } = data;
  const {
    page: { totalPages, currentPage, nextPage, previousPage },
  } = data;

  useEffect(() => {
    setAllCategories(categories);
  }, [categories]);

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let sortValue;
    if (e.target.value.toLowerCase().startsWith('old')) {
      sortValue = 'createdAt';
    }
    if (e.target.value.toLowerCase().startsWith('new')) {
      sortValue = '-createdAt';
    }
    if (e.target.value.toLowerCase().startsWith('a')) {
      sortValue = 'category';
    }
    if (e.target.value.toLowerCase().startsWith('z')) {
      sortValue = '-category';
    }

    sortParams.set('sort', sortValue as string);
    setSortParams(sortParams);
  };

  const handleSearchField = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchField(e.target.value.toLowerCase());
  };

  // get users based on the searchfield set in setSearch and the keyword typed into the search value input field.
  const handleSearchValue = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const resp = await getData({
      url: `/categories?search=${searchField}&value=${e.target.value}`,
    });

    if (e.target.value) {
      setAllCategories(resp.categories);
    } else {
      setAllCategories(categories);
    }
  };

  return (
    <AdminSection>
      {/* Header */}
      <AdminHeader>
        <h4>Manage categories</h4>
        <Link to='/admin/categories/add'>New category</Link>
      </AdminHeader>
      {/* Table Search */}
      <AppTableSearch
        searchOptions={['Category']}
        sortOptions={[
          'Old to new',
          'new to old',
          'A-Z: Category',
          'Z-A Category',
        ]}
        dark={true}
        bg='var(--admin-input-bg)'
        onSort={handleSort}
        onSearchField={handleSearchField}
        onSearchValue={handleSearchValue}
      />
      {/* Table */}
      <AdminBox>
        {allCategories.length > 0 ? (
          <>
            <Table headers={headers} column={column}>
              {allCategories.map((category) => (
                <TableRow $column={column} key={category._id}>
                  <img
                    src={category.photo || DEFAULT_USER_IMG}
                    alt={category.category}
                    width={40}
                    height={40}
                    className='rounded-img'
                  />
                  <p>{category.category}</p>
                  <p>
                    {category.createdAt &&
                      formatDate(new Date(category.createdAt))}
                  </p>
                  <ActionsBtns
                    editURL={`/admin/categories/edit/${category._id}`}
                    viewURL={`/admin/categories/view/${category._id}`}
                    id={category._id}
                  />
                </TableRow>
              ))}
            </Table>
            {totalPages > 1 && (
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                nextPage={nextPage}
                previousPage={previousPage}
                pageLink='/admin/categories'
                marginTop='2rem'
              />
            )}
          </>
        ) : (
          <Empty
            message='Categories is not available'
            showLink={false}
            type='dark'
          />
        )}
      </AdminBox>
    </AdminSection>
  );
};

export default Category;

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const params = extractParams(request);
  const { page, sort } = params;
  await queryClient.ensureQueryData({
    queryKey: ['categories', page ?? 1, sort ?? '-createdAt'],
    queryFn: () =>
      getData({
        url: `/categories?page=${page || 1}&sort=${sort || '-createdAt'}`,
      }),
  });

  return params;
};

// eslint-disable-next-line react-refresh/only-export-components
export const action = async ({ request }: ActionFunctionArgs) => {
  const { id } = await extractFormData(request);
  return await deleteData({
    url: `/categories/${id}`,
    redirectTo: '/admin/categories',
    invalidate: ['categories'],
  });
};
