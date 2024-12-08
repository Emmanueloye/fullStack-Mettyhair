import { extractParams, getData, queryClient } from '../../../api/requests';
import ActionsBtns from '../../../features/adminActions/ActionsBtns';
import {
  AdminBox,
  AdminHeader,
  AdminSection,
  Status,
  // Status,
} from '../../../features/adminNavLayouts/AdminUtils';
import Pagination from '../../../features/products/allProducts/Pagination';
import AppTableSearch from '../../../ui/AppTableSearch';
import Empty from '../../../ui/Empty';
import { Table, TableRow } from '../../../ui/Table';
import { useQuery } from '@tanstack/react-query';
import { User } from '../../../dtos/userDto';
import {
  LoaderFunctionArgs,
  useLoaderData,
  useSearchParams,
} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { DEFAULT_USER_IMG } from '../../../utilities/constant';

const AllUsers = () => {
  // To manage users data
  const [allUsers, setAllUsers] = useState<User[]>([]);
  // To manage search terms
  const [search, setSearch] = useState('');
  // To set sort values on the query params
  const [sortParams, setSortParams] = useSearchParams();
  // Get the page and sort query params from the loader.
  const params = useLoaderData() as { page: number; sort: string };
  const { page, sort } = params;

  // Table configuration
  const headers = ['image', 'user', 'email', 'status', 'action'];

  const column = '.5fr 1.3fr 1.4fr 1fr 1.3fr';

  // Fetch user data
  const { data } = useQuery({
    queryKey: ['users', page ?? 1, sort ?? '-createdAt'],
    queryFn: () =>
      getData({
        url: `/users?page=${+page || 1}&sort=${sort || '-createdAt'}`,
      }),
  });

  // Get users and pagination info from data.
  const { users }: { users: User[] } = data;
  const {
    page: { totalPages, currentPage, nextPage, previousPage },
  } = data;

  // Set users data into the state.
  useEffect(() => {
    setAllUsers(users);
  }, [users]);

  // Set sort value in the query params of the client url
  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let sortValue;
    if (e.target.value.toLowerCase().startsWith('old')) sortValue = 'createdAt';
    if (e.target.value.toLowerCase().startsWith('new'))
      sortValue = '-createdAt';
    sortParams.set('sort', sortValue as string);
    setSortParams(sortParams);
  };

  // set state for the search field e.g full name, email etc.
  const handleSearchField = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearch(e.target.value);
  };

  // get users based on the searchfield set in setSearch and the keyword typed into the search value input field.
  const handleSearchValue = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const resp = await getData({
      url: `/users?search=${search}&value=${e.target.value}`,
    });

    if (e.target.value) {
      setAllUsers(resp.users);
    } else {
      setAllUsers(users);
    }
  };

  return (
    <AdminSection>
      <AdminHeader>
        <h4>All users</h4>
      </AdminHeader>
      {/* Table search */}
      <AppTableSearch
        searchOptions={['full Name', 'email']}
        sortOptions={['old to new', 'new to old']}
        dark={true}
        bg='var(--admin-input-bg)'
        onSort={handleSort}
        onSearchField={handleSearchField}
        onSearchValue={handleSearchValue}
      />
      {/* Table */}
      <AdminBox>
        {users.length > 0 ? (
          <>
            <Table headers={headers} column={column}>
              {allUsers.map((user: User) => (
                <TableRow $column={column} key={user._id}>
                  <img
                    src={user.photo || DEFAULT_USER_IMG}
                    alt={user.fullName}
                    width={40}
                    height={40}
                  />
                  <p>{user.fullName}</p>
                  <p className='lowercase'>{user.email}</p>

                  <p>
                    {user.isVerified ? (
                      <Status $isActive={user.isVerified}>✔ Verified</Status>
                    ) : (
                      <Status>unverified</Status>
                    )}
                  </p>
                  <ActionsBtns
                    viewURL={`/admin/all-users/view/${user._id}`}
                    editURL={`/admin/all-users/edit/${user._id}`}
                    showDelete={false}
                  />
                </TableRow>
              ))}
            </Table>
            {/* Pagination. Only show if total pages is more than one. */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                nextPage={nextPage}
                previousPage={previousPage}
                marginTop='2rem'
                pageLink={`/admin/all-users`}
              />
            )}
          </>
        ) : (
          // show this when the data is empty.
          <Empty message={`No user available.`} showLink={false} type='dark' />
        )}
      </AdminBox>
    </AdminSection>
  );
};

export default AllUsers;

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const params = extractParams(request);

  const { page, sort } = params;

  await queryClient.ensureQueryData({
    queryKey: ['users', page ?? 1, sort ?? '-createdAt'],
    queryFn: () =>
      getData({
        url: `/users?page=${+page || 1}&sort=${sort || '-createdAt'}`,
      }),
  });

  return params;
};
