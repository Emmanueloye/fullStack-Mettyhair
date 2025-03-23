import { FaAddressBook, FaFlag, FaPhone, FaUserAlt } from 'react-icons/fa';
import InputGroup from '../authComponent/InputGroup';
import CheckoutInfoWrapper from './BillingAddressStyles';
import { MdMail } from 'react-icons/md';
import { BiSolidCity } from 'react-icons/bi';
import TextArea from '../../ui/TextArea';
import { Label } from '../../ui/Input';
import { OrderType } from '../../dtos/orderDto';
import Heading from '../../ui/Heading';

const BillingDetails = ({
  order,
  disabled,

  isDark,
}: {
  order: OrderType;
  disabled?: boolean;
  isDark?: boolean;
}) => {
  console.log(order);

  return (
    <div>
      <Heading title={'billing address'} />
      <CheckoutInfoWrapper $dark={isDark}>
        <div className='info-grid'>
          <div>
            <Label htmlFor='fullName'>Full name</Label>
            <InputGroup
              type='text'
              name='fullName'
              icon={<FaUserAlt />}
              mb='2.5rem'
              disabled={disabled || false}
              isDark={isDark}
              defaultValue={order.orderName}
              capitalize={true}
            />
          </div>
          <div>
            <Label htmlFor='email'>Full name</Label>
            <InputGroup
              type='email'
              name='email'
              icon={<MdMail />}
              mb='2.5rem'
              disabled={disabled || false}
              isDark={isDark}
              defaultValue={order?.user?.email}
            />
          </div>
          <div>
            <Label htmlFor='phone'>Phone</Label>
            <InputGroup
              type='text'
              name='phone'
              icon={<FaPhone />}
              mb='2.5rem'
              disabled={disabled || false}
              isDark={isDark}
              defaultValue={order.phone}
            />
          </div>
          <div>
            <Label htmlFor='address'>address</Label>
            <InputGroup
              type='text'
              name='address'
              icon={<FaAddressBook />}
              mb='2.5rem'
              disabled={disabled || false}
              isDark={isDark}
              defaultValue={order.address}
            />
          </div>
          <div>
            <Label htmlFor='state'>State</Label>
            <InputGroup
              type='text'
              name='state'
              icon={<BiSolidCity />}
              mb='2.5rem'
              disabled={disabled || false}
              isDark={isDark}
              defaultValue={order.state?.state}
              capitalize={true}
            />
          </div>
          <div>
            <Label htmlFor='city'>city</Label>
            <InputGroup
              type='text'
              name='city'
              icon={<BiSolidCity />}
              mb='2.5rem'
              disabled={disabled || false}
              isDark={isDark}
              defaultValue={order.city?.city}
              capitalize={true}
            />
          </div>

          <div>
            <Label htmlFor='country'>country</Label>
            <InputGroup
              type='text'
              name='country'
              placeholder='State*'
              icon={<FaFlag />}
              mb='2.5rem'
              disabled={disabled || false}
              isDark={isDark}
              defaultValue={order.country?.country}
              capitalize={true}
            />
          </div>
        </div>
        <TextArea
          id='note'
          rows={8}
          disabled={disabled || false}
          $dark={isDark}
          defaultValue={order.note}
        ></TextArea>
      </CheckoutInfoWrapper>
    </div>
  );
};

export default BillingDetails;
