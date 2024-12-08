import { Form } from 'react-router-dom';
import Input from '../../ui/Input';
import styled from 'styled-components';

const CouponBox = styled.article`
  background-color: var(--primary-white);
  padding: 2rem;
  margin-top: 3rem;
  form {
    position: relative;
  }
  .btn {
    background-color: var(--primary-blue);
    padding: 1rem 3rem;
    border: none;
    border-radius: 20rem;
    position: absolute;
    right: 0rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--primary-color);
    font-weight: 600;
  }
  .input {
    border-top-right-radius: 2rem;
    border-bottom-right-radius: 2rem;
  }
  @media screen and (min-width: 800px) {
    form {
      width: 70%;
    }
  }
`;

const Coupon = () => {
  return (
    <CouponBox>
      <Form method='post'>
        <Input type='text' placeholder='Enter Coupon Code' className='input' />
        <button className='btn'>Apply</button>
      </Form>
    </CouponBox>
  );
};

export default Coupon;
