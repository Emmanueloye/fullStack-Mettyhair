import {
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
import AppTableSearch from '../../../ui/AppTableSearch';
import { Table, TableRow } from '../../../ui/Table';
import { formatDate, formatNumber } from '../../../utilities/HelperFunc';
import Empty from '../../../ui/Empty';
import { extractParams, getData, queryClient } from '../../../api/requests';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ExpenseType } from '../../../dtos/ExpenseHeadDto';
import Pagination from '../../../features/products/allProducts/Pagination';
import { useEffect, useState } from 'react';
import { sortParamsSetting } from '../../../utilities/productSorting';

const Expenses = () => {
  const queryClientHook = useQueryClient();
  const [allExpenses, setAllExpenses] = useState<ExpenseType[]>([]);
  const [searchField, setSearchField] = useState('journalId');
  const [searchValue, setSearchValue] = useState('');

  const params = useLoaderData() as { page: number; sort: string };
  const [sortParams, setSortParams] = useSearchParams();
  // fetch expenses
  const { data } = useQuery({
    queryKey: [
      'fetchExpenses',
      'expenses',
      params.page ?? 1,
      params.sort ?? '-createdAt',
    ],
    queryFn: () =>
      getData({
        url: `/expenses?page=${params.page || 1}&sort=${
          params.sort || '-createdAt'
        }`,
      }),
  });

  const { expenses }: { expenses: ExpenseType[] } = data || [];

  const { totalPages, currentPage, nextPage, previousPage } = data.page;

  useEffect(() => {
    setAllExpenses(expenses);
  }, [expenses]);

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortValue = sortParamsSetting(e);

    sortParams.set('sort', sortValue as string);
    setSortParams(sortParams);
  };

  const handleSearchField = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchField(e.target.value);
  };

  const handleSearchValue = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    let timeOut: number | undefined;
    const filterData = async () => {
      const newUrl = `/expenses?search=${searchField}&value=${searchValue}`;

      timeOut = setTimeout(async () => {
        const resp = queryClientHook.fetchQuery({
          queryKey: ['fetchExpenses', 'expenses', searchValue],
          queryFn: () => getData({ url: newUrl }),
        });

        const data = await resp;

        if (searchValue) {
          setAllExpenses(data.expenses);
        } else {
          setAllExpenses(expenses);
        }
      }, 700);
    };

    filterData();
    return () => {
      clearTimeout(timeOut);
    };
  }, [expenses, searchValue]);

  // Table config
  const headers = [
    'journalId',
    'expense ID',
    'description',
    'amount',
    'postedBy',
    'posted date',
  ];
  const column = '1fr 1fr 1.5fr 1fr 1.2fr 1fr';

  return (
    <AdminSection>
      {/* Header */}
      <AdminHeader>
        <h4>Manage Expenses</h4>
        <Link to='/admin/account/expenses/new'>Expense Journal</Link>
      </AdminHeader>
      {/* Table search */}
      <AppTableSearch
        searchOptions={['journal Id', 'expense Id', 'description', 'posted By']}
        sortOptions={['old to new', 'new to old']}
        dark={true}
        bg='var(--admin-input-bg)'
        onSort={handleSort}
        onSearchField={handleSearchField}
        onSearchValue={handleSearchValue}
      />
      {/* Table */}
      <AdminBox>
        {allExpenses?.length > 0 ? (
          <>
            <Table headers={headers} column={column}>
              {allExpenses?.map((item) => (
                <TableRow $column={column} key={item._id}>
                  <p>{item.journalId}</p>
                  <p className='uppercase'>{item.expenseId}</p>
                  <p>{item.description}</p>
                  <p>{formatNumber(item.amount)}</p>
                  <p title={item.postedBy?.toUpperCase()}>{item.postedBy}</p>
                  <p>{formatDate(new Date(item.createdAt))}</p>
                </TableRow>
              ))}
            </Table>

            {totalPages > 1 && (
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                nextPage={nextPage}
                previousPage={previousPage}
                pageLink='/admin/account/expenses'
                marginTop='2rem'
              />
            )}
          </>
        ) : (
          <Empty message={'No Expenses Found.'} showLink={false} type='dark' />
        )}
      </AdminBox>
    </AdminSection>
  );
};

export default Expenses;

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const params = extractParams(request);

  await queryClient.ensureQueryData({
    queryKey: [
      'fetchExpenses',
      'expenses',
      params.page ?? 1,
      params.sort ?? '-createdAt',
    ],
    queryFn: () =>
      getData({
        url: `/expenses?page=${params.page || 1}&sort=${
          params.sort || '-createdAt'
        }`,
      }),
  });
  return params;
};
