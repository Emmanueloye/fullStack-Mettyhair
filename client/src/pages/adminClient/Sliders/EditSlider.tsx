/* eslint-disable react-refresh/only-export-components */
import {
  ActionFunctionArgs,
  Form,
  Link,
  LoaderFunctionArgs,
  useActionData,
  useLoaderData,
} from 'react-router-dom';
import {
  AdminHeader,
  AdminSection,
  AFormGroup,
} from '../../../features/adminNavLayouts/AdminUtils';
import {
  Center,
  TabContentWrapper,
} from '../../../features/Tab/TabContentWrapper';
import FormError from '../../../ui/FormError';
import Input, { Label } from '../../../ui/Input';
import Button from '../../../ui/Button';
import { getData, queryClient, updateData } from '../../../api/requests';
import { InfoType } from '../../../dtos/utilsDto';
import { GrUpdate } from 'react-icons/gr';
import { useQuery } from '@tanstack/react-query';
import { SliderTypes } from '../../../dtos/slidersDto';

const AddSlider = () => {
  const params = useLoaderData() as { id: string };
  const data = useActionData() as InfoType;

  const { data: sliderData } = useQuery({
    queryKey: ['fetchSlider', 'slider', params.id],
    queryFn: () => getData({ url: `/sliders/${params.id}` }),
  });

  const { slider }: { slider: SliderTypes } = sliderData;

  return (
    <AdminSection>
      <AdminHeader>
        <h4>update slider</h4>
        <Link to='/admin/sliders'>sliders</Link>
      </AdminHeader>
      <TabContentWrapper $dark={true}>
        <Form id='form' method='post' encType='multipart/form-data'>
          {data && <FormError info={data.message} />}

          <AFormGroup>
            <Label htmlFor='title'>slider title*</Label>
            <Input
              $dark={true}
              type='text'
              id='title'
              name='title'
              defaultValue={slider.title}
            />
          </AFormGroup>
          <AFormGroup>
            <Label htmlFor='description'>slider description*</Label>
            <Input
              $dark={true}
              type='text'
              id='description'
              name='description'
              defaultValue={slider.description}
            />
          </AFormGroup>
          <AFormGroup>
            <Label htmlFor='image'>slider image</Label>
            <Input $dark={true} type='file' id='image' name='image' />
            <Center style={{ marginTop: '3rem' }}>
              <img
                src={slider.image}
                alt={slider.title}
                width={50}
                height={50}
                className='rounded-img'
              />
            </Center>
          </AFormGroup>
          <AFormGroup>
            <Button btnText='update slider' icon={<GrUpdate />} />
          </AFormGroup>
        </Form>
      </TabContentWrapper>
    </AdminSection>
  );
};

export default AddSlider;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;
  await queryClient.ensureQueryData({
    queryKey: ['fetchSlider', 'slider', id],
    queryFn: () => getData({ url: `/sliders/${id}` }),
  });

  return params;
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const data = await request.formData();
  return updateData({
    url: `/sliders/${params.id}`,
    data,
    redirectTo: '/admin/sliders',
    setToast: true,
    invalidate: ['fetchSlider'],
  });
};
