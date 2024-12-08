// import { Form } from 'react-router-dom';
import Rating from '../../ui/Rating';

import {
  Center,
  ContentWrapper,
  FormButton,
  Group,
  RatingWrapper,
  TabContentWrapper,
} from './TabContentWrapper';
import Input from '../../ui/Input';
import TextArea from '../../ui/TextArea';
import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { User } from '../../dtos/userDto';
import LinkBtn from '../../ui/LinkBtn';
import { postData } from '../../api/requests';
import { ProductTypes } from '../../dtos/productsDto';
import FormError from '../../ui/FormError';
import { InfoType } from '../../dtos/utilsDto';
import { useQueryClient } from '@tanstack/react-query';

const ReviewTab = ({ product }: { product: ProductTypes }) => {
  const user = useOutletContext<User>();
  const queryClientHook = useQueryClient();

  // To get rating from rating component.
  const [rating, setRating] = useState<number>();
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<InfoType>();

  const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form);
    setIsLoading(true);
    const resp = await postData({
      url: `/products/${product._id}/reviews`,
      data,
      invalidate: ['fetchProduct'],
    });
    queryClientHook.invalidateQueries({ queryKey: ['fetchReview'] });

    if (resp.message.split(' ').includes('value.')) {
      setResponse({
        status: resp.status,
        message: 'You already add review to this product.',
      });
    } else {
      setResponse(resp);
    }

    setIsLoading(false);
  };
  return (
    <TabContentWrapper>
      {user ? (
        <>
          {/* Review headings */}
          <ContentWrapper>
            <h4>Add review</h4>
            <p>
              We will like to have your honest review about this product. Your
              review will help others to make informed decision.
            </p>
          </ContentWrapper>
          {/* Review form */}
          {response && <FormError info={response.message} />}
          <form onSubmit={handleForm}>
            <RatingWrapper>
              <span>Rating:</span>
              <Rating
                showRating={true}
                staticRating={false}
                getRating={setRating}
              />
              <input type='text' name='rating' defaultValue={rating} hidden />
            </RatingWrapper>
            <Group>
              <Input
                type='text'
                placeholder='Name*'
                name='name'
                defaultValue={user.fullName}
                autoComplete='off'
                $capitalize={true}
              />
              <Input
                type='text'
                placeholder='Email*'
                name='email'
                defaultValue={user.email}
                autoComplete='off'
              />
            </Group>
            <TextArea rows={10} cols={5} placeholder='Review*' name='review' />
            <Center>
              <FormButton type='submit' disabled={isLoading}>
                {isLoading ? 'Submitting...' : 'Submit'}
              </FormButton>
            </Center>
          </form>
        </>
      ) : (
        <ContentWrapper>
          <h4>Thank you for taking time to drop your review.</h4>
          <p>
            Please login to drop your review. We cannot wait to hear from you.
          </p>
          <LinkBtn btnText='Login' url='/login' />
        </ContentWrapper>
      )}
    </TabContentWrapper>
  );
};

export default ReviewTab;
