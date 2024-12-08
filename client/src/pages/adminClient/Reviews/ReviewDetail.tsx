/* eslint-disable react-refresh/only-export-components */
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  useLoaderData,
  useLocation,
} from 'react-router-dom';
import {
  AdminHeader,
  AdminSection,
  AFormGroup,
  TwoGrid,
} from '../../../features/adminNavLayouts/AdminUtils';
import { Link } from 'react-router-dom';
import { formatDate, slugifyText } from '../../../utilities/HelperFunc';
import {
  Center,
  TabContentWrapper,
} from '../../../features/Tab/TabContentWrapper';
import OrderActions from '../../../features/adminActions/OrderActions';
import Reviews from '../../../features/Tab/Reviews';
import {
  extractFormData,
  getData,
  queryClient,
  updateData,
} from '../../../api/requests';
import { useQuery } from '@tanstack/react-query';
import Input, { Label } from '../../../ui/Input';

const ReviewDetail = () => {
  const params = useLoaderData() as { id: string };
  const location = useLocation();
  const path = location.pathname;
  const label = path.split('/').slice(-2)[0].split('-').join(' ');

  const {
    data: { review },
  } = useQuery({
    queryKey: ['fetchReview', 'review', params.id],
    queryFn: () => getData({ url: `/reviews/${params.id}` }),
  });

  return (
    <AdminSection>
      <AdminHeader>
        <h4>Review details</h4>
        <Link to={`/admin/${slugifyText(label)}`}>{label}</Link>
      </AdminHeader>
      <TabContentWrapper $dark={true}>
        {/* approval btns */}
        <Center style={{ marginBottom: '2rem' }}>
          <OrderActions
            viewURL=''
            showView={false}
            showApproved={label.startsWith('pending') ? true : false}
            id={review._id}
          />
        </Center>
        <Center>
          <Reviews review={review} />
        </Center>
        <TwoGrid>
          <AFormGroup>
            <Label htmlFor='approvedBy'>Approved By</Label>
            <Input
              id='approvedBy'
              type='text'
              $dark
              defaultValue={review?.approvedBy?.fullName}
              $capitalize={true}
            />
          </AFormGroup>
          <AFormGroup>
            <Label htmlFor='approvedDate'>Approved Date</Label>
            <Input
              id='approvedDate'
              type='text'
              $dark
              defaultValue={
                review?.approvedDate &&
                formatDate(new Date(review.approvedDate))
              }
              $capitalize={true}
            />
          </AFormGroup>
        </TwoGrid>
      </TabContentWrapper>
    </AdminSection>
  );
};

export default ReviewDetail;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  await queryClient.ensureQueryData({
    queryKey: ['fetchReview', 'review', params.id],
    queryFn: () => getData({ url: `/reviews/${params.id}` }),
  });
  return params;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { id, ...data } = await extractFormData(request);

  // Get the parent path to redirect back to.
  const parentPath = request.url.split('/');
  parentPath.pop();

  const resp = await updateData({
    url: `/reviews/${id}`,
    data,
    invalidate: ['fetchReview'],
    setToast: true,
    redirectTo: parentPath.join('/'),
  });
  queryClient.invalidateQueries({ queryKey: ['fetchProduct'] });
  return resp;
};
