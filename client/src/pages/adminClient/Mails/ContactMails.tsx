import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import {
  AdminBox,
  AdminHeader,
  AdminSection,
} from '../../../features/adminNavLayouts/AdminUtils';
import { Table, TableRow } from '../../../ui/Table';
import Empty from '../../../ui/Empty';
import Pagination from '../../../features/products/allProducts/Pagination';
import AppTableSearch from '../../../ui/AppTableSearch';
import {
  deleteData,
  extractFormData,
  extractParams,
  getData,
  queryClient,
  updateData,
} from '../../../api/requests';
import { useQuery } from '@tanstack/react-query';
import { formatDate } from '../../../utilities/HelperFunc';
import { useEffect, useState } from 'react';
import { MailTypes } from '../../../dtos/mailsDto';
import MailBtns from '../../../features/adminActions/MailBtns';
import { MdOutlineReply } from 'react-icons/md';

const Category = () => {
  const [allMails, setAllMails] = useState<MailTypes[]>([]);
  const [searchField, setSearchField] = useState('email');
  const { page, sort } = useLoaderData() as { page: number; sort: string };
  const [sortParams, setSortParams] = useSearchParams();
  const navigate = useNavigate();

  // Table config
  const headers = ['name', 'subject', 'date', 'action'];
  const column = '1fr 1.5fr .7fr .5fr';

  const { data } = useQuery({
    queryKey: ['fetchContact', 'contacts', page ?? 1, sort ?? '-createdAt'],
    queryFn: () =>
      getData({
        url: `/contacts?page=${page || 1}&sort=${sort || '-createdAt'}`,
      }),
  });

  const { contacts }: { contacts: MailTypes[] } = data;
  const {
    page: { totalPages, currentPage, nextPage, previousPage },
  } = data;

  useEffect(() => {
    setAllMails(contacts);
  }, [contacts]);

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
    setSearchField(e.target.value);
  };

  // get users based on the searchfield set in setSearch and the keyword typed into the search value input field.
  const handleSearchValue = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const resp = await getData({
      url: `/contacts?search=${searchField}&value=${e.target.value}`,
    });

    if (e.target.value) {
      setAllMails(resp.contacts);
    } else {
      setAllMails(contacts);
    }
  };

  const handleMailView = async (id: string, isRead: boolean) => {
    if (isRead) {
      navigate(`/admin/contacts/view/${id}`);
      return;
    } else {
      await updateData({
        url: `/contacts/${id}`,
        data: { isRead: !isRead },
        invalidate: ['fetchContact'],
      });
      navigate(`/admin/contacts/view/${id}`);
    }
  };
  return (
    <AdminSection>
      {/* Header */}
      <AdminHeader>
        <h4>Mails from Contact form</h4>
      </AdminHeader>
      {/* Table Search */}
      <AppTableSearch
        searchOptions={['email', 'subject', 'full name']}
        sortOptions={['Old to new', 'new to old']}
        dark={true}
        bg='var(--admin-input-bg)'
        onSort={handleSort}
        onSearchField={handleSearchField}
        onSearchValue={handleSearchValue}
      />
      {/* Table */}
      <AdminBox>
        {allMails.length > 0 ? (
          <>
            <Table headers={headers} column={column}>
              {allMails.map((mail) => {
                // for message formating
                const subject =
                  mail.subject?.length <= 47
                    ? mail.subject
                    : `${mail.subject?.substring(0, 47)}...`;

                // format of read and unread
                const readStatus = mail.isRead ? '' : 'unread';
                return (
                  <TableRow
                    $column={column}
                    key={mail._id}
                    className={readStatus}
                  >
                    <p
                      className='t-body'
                      onClick={() => handleMailView(mail._id, mail.isRead)}
                      style={{ cursor: 'pointer' }}
                    >
                      {mail.isRead ? '✔' : '👁'} {mail.fullName.split(' ')[0]}{' '}
                      {mail.repliedTo && <MdOutlineReply />}
                    </p>
                    <p
                      className='t-body'
                      onClick={() => handleMailView(mail._id, mail.isRead)}
                      style={{ cursor: 'pointer' }}
                    >
                      {subject}
                    </p>
                    <p
                      className='t-body'
                      onClick={() => handleMailView(mail._id, mail.isRead)}
                      style={{ cursor: 'pointer' }}
                    >
                      {mail.createdAt && formatDate(new Date(mail.createdAt))}
                    </p>
                    {/* action - delete and mark as read */}
                    <MailBtns isRead={mail.isRead} id={mail._id} />
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
                pageLink='/admin/contacts'
                marginTop='2rem'
              />
            )}
          </>
        ) : (
          <Empty message='You have no message.' showLink={false} type='dark' />
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
    queryKey: ['fetchContact', 'contacts', page ?? 1, sort ?? '-createdAt'],
    queryFn: () =>
      getData({
        url: `/contacts?page=${page || 1}&sort=${sort || '-createdAt'}`,
      }),
  });

  return params;
};

// eslint-disable-next-line react-refresh/only-export-components
export const action = async ({ request }: ActionFunctionArgs) => {
  const { id, isRead } = await extractFormData(request);
  if (request.method === 'DELETE') {
    return deleteData({
      url: `/contacts/${id}`,
      invalidate: ['fetchContact'],
    });
  }

  if (request.method === 'PATCH') {
    return updateData({
      url: `/contacts/${id}`,
      data: { isRead },
      setToast: true,
      invalidate: ['fetchContact'],
    });
  }
};
