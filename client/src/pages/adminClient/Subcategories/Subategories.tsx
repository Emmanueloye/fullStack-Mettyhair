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
} from '../../../features/adminNavLayouts/AdminUtils';
import { Table, TableRow } from '../../../ui/Table';
import ActionsBtns from '../../../features/adminActions/ActionsBtns';
import Pagination from '../../../features/products/allProducts/Pagination';
import Empty from '../../../ui/Empty';
import AppTableSearch from '../../../ui/AppTableSearch';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  deleteData,
  extractFormData,
  extractParams,
  getData,
  queryClient,
  updateData,
} from '../../../api/requests';
import { SubcategoriesType } from '../../../dtos/categoriesDto';
import { formatDate } from '../../../utilities/HelperFunc';

// const sections = [];

const Subcategories = () => {
  const [allSubcategories, setAllSubcategories] = useState<SubcategoriesType[]>(
    []
  );
  const [searchField, setSearchField] = useState('subcategory');
  const { page, sort } = useLoaderData() as { page: number; sort: string };
  const [sortParams, setSortParams] = useSearchParams();

  const { data } = useQuery({
    queryKey: ['subcategories', page ?? 1, sort ?? '-createdAt'],
    queryFn: () =>
      getData({
        url: `/subcategories?page=${page || 1}&sort=${sort || '-createdAt'}`,
      }),
  });

  const { subcategories }: { subcategories: SubcategoriesType[] } = data;

  const {
    page: { totalPages, currentPage, nextPage, previousPage },
  } = data;

  useEffect(() => {
    setAllSubcategories(subcategories);
  }, [subcategories]);

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let sortValue;
    if (e.target.value.toLowerCase().startsWith('old')) {
      sortValue = 'createdAt';
    }
    if (e.target.value.toLowerCase().startsWith('new')) {
      sortValue = '-createdAt';
    }
    if (e.target.value.toLowerCase().startsWith('a')) {
      sortValue = 'subcategory';
    }
    if (e.target.value.toLowerCase().startsWith('z')) {
      sortValue = '-subcategory';
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
      url: `/subcategories?search=${searchField}&value=${e.target.value}`,
    });

    if (e.target.value) {
      setAllSubcategories(resp.subcategories);
    } else {
      setAllSubcategories(subcategories);
    }
  };

  const headers = ['subcategory', 'category', 'Created Date', 'action'];
  const column = '1fr 1fr 1fr 1.5fr';
  return (
    <AdminSection>
      {/* Header */}
      <AdminHeader>
        <h4>Manage Subcategories</h4>
        <Link to='/admin/Subcategories/add'>New subcategory</Link>
      </AdminHeader>
      {/* table search */}
      <AppTableSearch
        searchOptions={['Subcategory']}
        sortOptions={[
          'Old to new',
          'new to old',
          'A-Z: Subcategory',
          'Z-A Subcategory',
        ]}
        dark={true}
        bg='var(--admin-input-bg)'
        onSort={handleSort}
        onSearchField={handleSearchField}
        onSearchValue={handleSearchValue}
      />
      {/* Table */}
      <AdminBox>
        {allSubcategories.length > 0 ? (
          <>
            <Table headers={headers} column={column}>
              {allSubcategories.map((subcategory) => (
                <TableRow $column={column} key={subcategory._id}>
                  <p>{subcategory.subcategory}</p>
                  <p>{subcategory.category.category}</p>
                  <p>
                    {subcategory.createdAt &&
                      formatDate(new Date(subcategory.createdAt))}
                  </p>
                  <ActionsBtns
                    showActivation={true}
                    editURL={`/admin/subcategories/edit/${subcategory._id}`}
                    viewURL={`/admin/subcategories/view/${subcategory._id}`}
                    id={subcategory._id}
                    isActive={subcategory.isActive}
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
                pageLink='/admin/subcategories'
                marginTop='2rem'
              />
            )}
          </>
        ) : (
          <Empty
            message='Subcategories data is not available'
            showLink={false}
            type='dark'
          />
        )}
      </AdminBox>
    </AdminSection>
  );
};

export default Subcategories;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const params = extractParams(request);
  const { page, sort } = params;
  await queryClient.ensureQueryData({
    queryKey: ['subcategories', page ?? 1, sort ?? '-createdAt'],
    queryFn: () =>
      getData({
        url: `/subcategories?page=${page || 1}&sort=${sort || '-createdAt'}`,
      }),
  });

  return params;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { id, ...data } = await extractFormData(request);
  if (request.method === 'PATCH') {
    return updateData({
      url: `/subcategories/${id}`,
      data,
      redirectTo: '/admin/subcategories',
      setToast: true,
      invalidate: ['subcategories'],
    });
  }

  if (request.method === 'DELETE') {
    return await deleteData({
      url: `/subcategories/${id}`,
      redirectTo: '/admin/subcategories',
      invalidate: ['subcategories'],
    });
  }
};
