/* eslint-disable react-refresh/only-export-components */
import {
  AdminBox,
  AdminHeader,
  AdminSection,
  Status,
} from '../../../features/adminNavLayouts/AdminUtils';
import Pagination from '../../../features/products/allProducts/Pagination';

import { Table, TableRow } from '../../../ui/Table';
import { DEFAULT_USER_IMG } from '../../../utilities/constant';
import { extractParams, getData, queryClient } from '../../../api/requests';
import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { formatDate } from '../../../utilities/HelperFunc';
import { User } from '../../../dtos/userDto';
import { useEffect, useState } from 'react';
import Empty from '../../../ui/Empty';

const UserReport = () => {
  const { page, sort } = useLoaderData() as { page: number; sort: string };
  const [usersReport, setUserReport] = useState<User[]>([]);

  const {
    data: { users, page: pagination },
  } = useQuery({
    queryKey: ['users', 'user-report', page ?? 1, sort ?? '-createdAt'],
    queryFn: () =>
      getData({
        url: `/users/get-user-report?page=${+page || 1}&sort=${
          sort || '-createdAt'
        }`,
      }),
  });

  const { totalPage, currentPage, previousPage, nextPage } = pagination;

  useEffect(() => {
    setUserReport(users);
  }, [users]);

  // Table configuration
  const headers = [
    'image',
    'full name',
    'email',
    'status',
    'created Date',
    'verify date',
  ];

  const column = '.5fr 1.3fr 1.4fr 1fr 1fr 1fr';

  // const users = [];
  return (
    <AdminSection>
      <AdminHeader>
        <h4>New users Report</h4>
      </AdminHeader>
      {/* Table report form */}
      {/* <Form id='form' method='post'>
        <ThreeGrid>
          <AFormGroup>
            <Label htmlFor='startDate'>Start Date</Label>
            <Input type='date' name='startDate' id='startDate' $dark />
          </AFormGroup>
          <AFormGroup>
            <Label htmlFor='endDate'>End Date</Label>
            <Input type='date' name='endDate' id='endDate' $dark />
          </AFormGroup>
          <div
            style={{ display: 'flex', alignItems: 'center', marginTop: '2rem' }}
          >
            <Button btnText='submit' icon={<MdSend />} type='submit' />
          </div>
        </ThreeGrid>
      </Form> */}

      {/* Table */}
      <AdminBox>
        {usersReport.length > 0 ? (
          <>
            {usersReport.map((user: User) => (
              <Table headers={headers} column={column} key={user._id}>
                <TableRow $column={column}>
                  <img
                    src={user.photo || DEFAULT_USER_IMG}
                    alt='name'
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
                  <p>
                    {user.createdAt && formatDate(new Date(user.createdAt))}
                  </p>
                  {user.verifiedDate ? (
                    <p>{formatDate(new Date(user.verifiedDate))}</p>
                  ) : (
                    <p className='lowercase'>xxxxxxx</p>
                  )}
                </TableRow>
              </Table>
            ))}
            {/* Pagination. Only show if total pages is more than one. */}

            {totalPage > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPage}
                nextPage={nextPage}
                previousPage={previousPage}
                marginTop='2rem'
                pageLink={`/admin/users-report`}
              />
            )}
          </> // show this when the data is empty.
        ) : (
          <Empty message={`No data available.`} showLink={false} type='dark' />
        )}
      </AdminBox>
    </AdminSection>
  );
};

export default UserReport;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const params = extractParams(request);

  const { page, sort } = params;

  await queryClient.ensureQueryData({
    queryKey: ['users', 'user-report', page ?? 1, sort ?? '-createdAt'],
    queryFn: () =>
      getData({
        url: `/users/get-user-report?page=${+page || 1}&sort=${
          sort || '-createdAt'
        }`,
      }),
  });

  return params;
};
