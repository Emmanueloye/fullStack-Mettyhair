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
import Empty from '../../../ui/Empty';
import ActionsBtns from '../../../features/adminActions/ActionsBtns';
import {
  extractFormData,
  extractParams,
  getData,
  queryClient,
  updateData,
} from '../../../api/requests';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ExpenseHeadType } from '../../../dtos/ExpenseHeadDto';
import { formatDate } from '../../../utilities/HelperFunc';
import Pagination from '../../../features/products/allProducts/Pagination';
import { useEffect, useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';

const ExpenseHead = () => {
  const params = useLoaderData() as { page: number; sort: string };
  const [allExpenseHead, setAllExpenseHead] = useState<ExpenseHeadType[]>([]);
  const [searchField, setSearchField] = useState('headId');
  const [searchValue, setSearchValue] = useState('');
  const [sortParams, setSortParams] = useSearchParams();
  const queryClientHook = useQueryClient();

  const { data } = useQuery({
    queryKey: [
      'fetchExpenseHead',
      'expenseHeads',
      params?.page ?? 1,
      params?.sort ?? '-createdAt',
    ],
    queryFn: () =>
      getData({
        url: `/expense-head?page=${params?.page || 1}&sort=${
          params?.sort || '-createdAt'
        }`,
      }),
  });

  const { expenseHeads }: { expenseHeads: ExpenseHeadType[] } = data || {};
  const { totalPages, currentPage, nextPage, previousPage } = data?.page || {};

  useEffect(() => {
    setAllExpenseHead(expenseHeads);
  }, [expenseHeads]);

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let sortValue;

    if (e.target.value.toLowerCase().startsWith('old')) {
      sortValue = 'createdAt';
    }
    if (e.target.value.toLowerCase().startsWith('new')) {
      sortValue = '-createdAt';
    }
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
    let timeOut: NodeJS.Timeout;
    const filterData = async () => {
      const newUrl = `/expense-head?search=${encodeURIComponent(
        searchField
      )}&value=${encodeURIComponent(searchValue)}`;

      timeOut = setTimeout(async () => {
        const resp = queryClientHook.fetchQuery({
          queryKey: ['fetchExpenseHead', 'expenseHeads', searchValue],
          queryFn: () => getData({ url: newUrl }),
        });

        const data = await resp;

        if (searchValue) {
          setAllExpenseHead(data?.expenseHeads);
        } else {
          setAllExpenseHead(expenseHeads);
        }
      }, 1000);
    };

    filterData();
    return () => {
      clearTimeout(timeOut);
    };
  }, [expenseHeads, queryClientHook, searchValue]);

  // Table config
  const headers = [
    'head Id',
    'description',
    'status',
    'created by',
    'created date',
    'action',
  ];
  const column = ' 1fr 1fr 1fr 1fr 1fr 1fr';

  return (
    <AdminSection>
      {/* Header */}
      <AdminHeader>
        <h4>Manage Expense Heads</h4>
        <Link to='/admin/account/expense-head/new'>New Expense head</Link>
      </AdminHeader>
      {/* Table search */}
      <AppTableSearch
        searchOptions={['headId', 'description']}
        sortOptions={['old to new', 'new to old']}
        dark={true}
        bg='var(--admin-input-bg)'
        onSort={handleSort}
        onSearchField={handleSearchField}
        onSearchValue={handleSearchValue}
      />
      {/* Table */}
      <AdminBox>
        {allExpenseHead?.length > 0 ? (
          <>
            <Table headers={headers} column={column}>
              {allExpenseHead?.map((item) => {
                return (
                  <TableRow $column={column} key={item.headId}>
                    <p>{item.headId}</p>
                    <p>{item.description}</p>
                    <p>
                      {item.isActive ? (
                        <Status $isActive={item.isActive}>
                          <FaCheck />
                        </Status>
                      ) : (
                        <Status>
                          <FaTimes />
                        </Status>
                      )}
                    </p>
                    <p>{item.createdBy.fullName}</p>
                    <p>{formatDate(new Date(item.createdAt))}</p>
                    <ActionsBtns
                      editURL={`/admin/account/expense-head/edit/${item._id}`}
                      viewURL={`/admin/account/expense-head/view/${item._id}`}
                      id={item._id}
                      isActive={item.isActive}
                      showActivation
                      showDelete={false}
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
                pageLink='/admin/account/expense-head'
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

export default ExpenseHead;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const params = extractParams(request);
  const { page, sort } = params;
  await queryClient.ensureQueryData({
    queryKey: [
      'fetchExpenseHead',
      'expenseHeads',
      page ?? 1,
      sort ?? '-createdAt',
    ],
    queryFn: () =>
      getData({
        url: `/expense-head?page=${page || 1}&sort=${sort || '-createdAt'}`,
      }),
  });
  return params;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { id, ...data } = await extractFormData(request);
  return updateData({
    url: `/expense-head/${id}`,
    data,
    setToast: true,
    invalidate: ['fetchExpenseHead'],
  });
};
