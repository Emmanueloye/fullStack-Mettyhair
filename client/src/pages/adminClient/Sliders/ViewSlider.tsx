/* eslint-disable react-refresh/only-export-components */
import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
import { getData, queryClient } from '../../../api/requests';
import { useQuery } from '@tanstack/react-query';
import { SliderTypes } from '../../../dtos/slidersDto';
import {
  AdminSection,
  AFormGroup,
  TwoGrid,
} from '../../../features/adminNavLayouts/AdminUtils';
import AdminHero from '../../../features/hero/AdminHero';
import Input, { Label } from '../../../ui/Input';
import { formatDate } from '../../../utilities/HelperFunc';

const ViewSlider = () => {
  const params = useLoaderData() as { id: string };
  const { data: sliderData } = useQuery({
    queryKey: ['fetchSlider', 'slider', params.id],
    queryFn: () => getData({ url: `/sliders/${params.id}` }),
  });

  const { slider }: { slider: SliderTypes } = sliderData;
  return (
    <AdminSection>
      <AdminHero slide={slider} padding={true} />

      {/* created by section */}
      <TwoGrid>
        <AFormGroup>
          <Label htmlFor='createdBy'>Created by</Label>
          <Input
            id='createdBy'
            defaultValue={slider?.createdBy?.fullName}
            $dark
            $capitalize={true}
          />
        </AFormGroup>
        <AFormGroup>
          <Label htmlFor='updatedDate'>Created date</Label>
          <Input
            id='createdDate'
            defaultValue={
              slider.createdAt && formatDate(new Date(slider.createdAt))
            }
            $dark
            $capitalize={true}
          />
        </AFormGroup>
      </TwoGrid>
      {/* Updated by section */}
      <TwoGrid>
        <AFormGroup>
          <Label htmlFor='updatedBy'>updated by</Label>
          <Input
            id='updatedBy'
            defaultValue={slider?.updatedBy?.fullName}
            $dark
            $capitalize={true}
          />
        </AFormGroup>
        <AFormGroup>
          <Label htmlFor='updatedDate'>updated date</Label>
          <Input
            id='updatedDate'
            defaultValue={
              slider.updatedAt && formatDate(new Date(slider.updatedAt))
            }
            $dark
            $capitalize={true}
          />
        </AFormGroup>
      </TwoGrid>
    </AdminSection>
  );
};

export default ViewSlider;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;
  await queryClient.ensureQueryData({
    queryKey: ['fetchSlider', 'slider', id],
    queryFn: () => getData({ url: `/sliders/${id}` }),
  });

  return params;
};
