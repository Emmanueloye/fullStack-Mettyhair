import { FaAddressBook, FaFlag, FaPhone, FaUserAlt } from 'react-icons/fa';
import { FormGroup, Header } from '../authComponent/AuthStyles';
import InputGroup from '../authComponent/InputGroup';
import CheckoutInfoWrapper from './BillingAddressStyles';
import { MdMail } from 'react-icons/md';
import { BiSolidCity } from 'react-icons/bi';
import SelectInput from '../../ui/SelectInput';
import TextArea from '../../ui/TextArea';
import { User } from '../../dtos/userDto';
import { InfoType } from '../../dtos/utilsDto';
import FormError from '../../ui/FormError';

const BillingAddress = ({
  user,
  error,
  disabled,
  bg,
  color,
  isDark,
}: {
  user?: User;
  error?: InfoType;
  disabled?: boolean;
  bg?: string;
  color?: string;
  isDark?: boolean;
}) => {
  return (
    <div>
      <Header $mb='1rem' $bg={bg} $color={color}>
        <h4>billing address</h4>
      </Header>
      <CheckoutInfoWrapper $dark={isDark}>
        {error && <FormError info={error.message} />}
        <div className='info-grid'>
          <InputGroup
            type='text'
            name='fullName'
            placeholder='Full name*'
            icon={<FaUserAlt />}
            mb='2.5rem'
            disabled={disabled || false}
            isDark={isDark}
            defaultValue={user?.fullName}
            capitalize={true}
          />
          <InputGroup
            type='email'
            name='email'
            placeholder='Email*'
            icon={<MdMail />}
            mb='2.5rem'
            disabled={disabled || false}
            isDark={isDark}
            defaultValue={user?.email}
          />
          <InputGroup
            type='text'
            name='phone'
            placeholder='Phone*'
            icon={<FaPhone />}
            mb='2.5rem'
            disabled={disabled || false}
            isDark={isDark}
            defaultValue={user?.phone}
          />
          <InputGroup
            type='text'
            name='address'
            placeholder='Address*'
            icon={<FaAddressBook />}
            mb='2.5rem'
            disabled={disabled || false}
            isDark={isDark}
            defaultValue={user?.address}
          />
          <InputGroup
            type='text'
            name='state'
            placeholder='State*'
            icon={<BiSolidCity />}
            mb='2.5rem'
            disabled={disabled || false}
            isDark={isDark}
            defaultValue={user?.state}
            capitalize={true}
          />

          <FormGroup $height='4.4rem'>
            <SelectInput
              name='country'
              bg={bg || 'var(--grey)'}
              width='100%'
              disabled={disabled || false}
            >
              <option value='Nigeria'>{user?.country}</option>
              <option value='United Kingdon'>United Kingdom</option>
            </SelectInput>
            <span className='a-icon'>
              <FaFlag />
            </span>
          </FormGroup>
        </div>
        <TextArea
          rows={8}
          placeholder='Note about your order e.g. special note for delivery. This is optional.'
          disabled={disabled || false}
          $dark={isDark}
          name='note'
        />
      </CheckoutInfoWrapper>
    </div>
  );
};

export default BillingAddress;
