/* eslint-disable react-refresh/only-export-components */
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  useLoaderData,
  useLocation,
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
import Pagination from '../../../features/products/allProducts/Pagination';
import Empty from '../../../ui/Empty';
import OrderActions from '../../../features/adminActions/OrderActions';
import { slugifyText } from '../../../utilities/HelperFunc';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
  extractFormData,
  extractParams,
  getData,
  queryClient,
  updateData,
} from '../../../api/requests';
import { ReviewTypes } from '../../../dtos/productsDto';

const ReviewList = () => {
  const location = useLocation();
  const path = location.pathname;
  const label = path.split('/').slice(-1)[0].split('-').join(' ');
  // console.log(path);

  const [allReviews, setAllReviews] = useState<ReviewTypes[]>([]);

  const { page, sort, pageName } = useLoaderData() as {
    page: number;
    sort: string;
    pageName: string;
  };
  const [sortParams, setSortParams] = useSearchParams();

  const { data } = useQuery({
    queryKey: [
      'fetchReview',
      'reviews',
      page ?? 1,
      sort ?? '-createdAt',
      pageName ?? '',
    ],
    queryFn: () =>
      getData({
        url: `/reviews?page=${page || 1}&sort=${
          sort || '-createdAt'
        }&isApproved=${pageName === 'approved-reviews'}`,
      }),
  });

  const { reviews }: { reviews: ReviewTypes[] } = data || {};

  const { totalPages, currentPage, nextPage, previousPage } = data.page;

  useEffect(() => {
    setAllReviews(reviews);
  }, [reviews]);

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

  // console.log(allReviews);

  const headers = ['customer', 'rating', 'review', 'status', 'action'];
  const column = '1fr .5fr 1fr 1fr 1.3fr';
  return (
    <AdminSection>
      {/* Header */}
      <AdminHeader>
        <h4>{label}</h4>
      </AdminHeader>
      {/* Table search */}
      <AppTableSearch
        searchOptions={['status']}
        showSearch={false}
        sortOptions={['old to new', 'new to old']}
        dark={true}
        bg='var(--admin-input-bg)'
        onSort={handleSort}
      />
      {/* Table */}
      <AdminBox>
        {allReviews.length > 0 ? (
          <>
            <Table headers={headers} column={column}>
              {allReviews.map((review) => (
                <TableRow $column={column} key={review._id}>
                  <p>{review.user.fullName}</p>
                  <p>{review.rating}</p>
                  <p>
                    {review.review.length > 20
                      ? `${review.review.substring(0, 20)}...`
                      : review.review}
                  </p>

                  <p>
                    {review.isApproved ? (
                      <Status $isActive={review.isApproved}>Approved</Status>
                    ) : (
                      <Status>pending</Status>
                    )}
                  </p>

                  <OrderActions
                    viewURL={`/admin/${slugifyText(label)}/${review._id}`}
                    showApproved={label.startsWith('pending')}
                    showDisapproved={review.isApproved}
                    id={review._id}
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
                pageLink='/admin/products'
                marginTop='2rem'
              />
            )}
          </>
        ) : (
          <Empty
            message={`No ${label} awaiting your action.`}
            showLink={false}
            type='dark'
          />
        )}
      </AdminBox>
    </AdminSection>
  );
};

export default ReviewList;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const params = extractParams(request);
  const lastURLParams = request.url.split('/');
  const pageName = lastURLParams[lastURLParams.length - 1].split('?')[0];

  const { page, sort } = params;
  await queryClient.ensureQueryData({
    queryKey: [
      'fetchReview',
      'reviews',
      page ?? 1,
      sort ?? '-createdAt',
      pageName ?? '',
    ],
    queryFn: () =>
      getData({
        url: `/reviews?page=${page || 1}&sort=${
          sort || '-createdAt'
        }&isApproved=${pageName === 'approved-reviews'}`,
      }),
  });

  return { ...params, pageName };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { id, ...data } = await extractFormData(request);

  const resp = await updateData({
    url: `/reviews/${id}`,
    data,
    invalidate: ['fetchReview'],
    setToast: true,
  });
  queryClient.invalidateQueries({ queryKey: ['fetchProduct'] });
  return resp;
};
