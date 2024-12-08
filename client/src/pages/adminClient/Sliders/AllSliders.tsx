/* eslint-disable react-refresh/only-export-components */
import {
  ActionFunctionArgs,
  Link,
  LoaderFunctionArgs,
  useLoaderData,
} from 'react-router-dom';
import {
  AdminBox,
  AdminHeader,
  AdminSection,
  Status,
} from '../../../features/adminNavLayouts/AdminUtils';
import { Table, TableRow } from '../../../ui/Table';
import { FaCheck, FaTimes } from 'react-icons/fa';
import ActionsBtns from '../../../features/adminActions/ActionsBtns';
import Pagination from '../../../features/products/allProducts/Pagination';
import Empty from '../../../ui/Empty';
import {
  deleteData,
  extractFormData,
  extractParams,
  getData,
  queryClient,
  updateData,
} from '../../../api/requests';
import { useQuery } from '@tanstack/react-query';
import { SliderTypes } from '../../../dtos/slidersDto';

const AllSliders = () => {
  const { page, sort } = useLoaderData() as { page: number; sort: string };

  const { data } = useQuery({
    queryKey: ['fetchSlider', 'sliders', page ?? 1, sort ?? '-createdAt'],
    queryFn: () =>
      getData({
        url: `/sliders?page=${page || 1}&sort=${sort || '-createdAt'}`,
      }),
  });

  const { sliders }: { sliders: SliderTypes[] } = data;
  const { totalPages, currentPage, nextPage, previousPage } = data.page;

  const headers = ['image', 'title', 'description', 'status', 'action'];
  const column = '0.6fr 1.7fr 1.7fr 1fr 1.8fr';
  return (
    <>
      <AdminSection>
        {/* Header */}
        <AdminHeader>
          <h4>Manage Sliders</h4>
          <Link to='/admin/sliders/add'>New slider</Link>
        </AdminHeader>

        {/* Table */}
        <AdminBox>
          {sliders?.length > 0 ? (
            <>
              <Table headers={headers} column={column}>
                {sliders.map((slide) => {
                  const title =
                    slide.title.length > 40
                      ? `${slide.title.substring(0, 40)}...`
                      : slide.title;

                  const description =
                    slide.description.length > 40
                      ? `${slide.description.substring(0, 40)}...`
                      : slide.description;
                  return (
                    <TableRow $column={column} key={slide._id}>
                      <img
                        src={slide.image}
                        alt={slide.title}
                        width={40}
                        height={40}
                        className='rounded-img'
                      />
                      <p>{title}</p>
                      <p>{description}</p>

                      <p>
                        {slide.isActive ? (
                          <Status $isActive={slide.isActive}>
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
                        editURL={`/admin/sliders/edit/${slide._id}`}
                        viewURL={`/admin/sliders/view/${slide._id}`}
                        isActive={slide.isActive}
                        id={slide._id}
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
                  pageLink='/admin/sliders'
                  marginTop='2rem'
                />
              )}
            </>
          ) : (
            <Empty
              message={'No product is not available'}
              showLink={false}
              type='dark'
            />
          )}
        </AdminBox>
      </AdminSection>
    </>
  );
};

export default AllSliders;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const params = extractParams(request);
  const { page, sort } = params;
  await queryClient.ensureQueryData({
    queryKey: ['fetchSlider', 'sliders', page ?? 1, sort ?? '-createdAt'],
    queryFn: () =>
      getData({
        url: `/sliders?page=${page || 1}&sort=${sort || '-createdAt'}`,
      }),
  });

  return params;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { id, ...data } = await extractFormData(request);
  console.log({ id, data });

  if (request.method === 'PATCH') {
    return updateData({
      url: `/sliders/${id}`,
      data,
      setToast: true,
      invalidate: ['fetchSlider'],
    });
  }
  if (request.method === 'DELETE') {
    return deleteData({
      url: `/sliders/${id}`,
      redirectTo: '/admin/slider',
      invalidate: ['fetchSlider'],
    });
  }
};
