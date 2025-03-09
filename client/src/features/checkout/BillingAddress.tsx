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
import { FaTreeCity } from 'react-icons/fa6';
import { CityType, CountryType, StateType } from '../../dtos/locationDto';
import { useState } from 'react';
import { getOnlyData } from '../../api/requests';

const BillingAddress = ({
  user,
  error,
  countries,
  disabled,
  bg,
  color,
  isDark,
}: {
  user?: User;
  error?: InfoType;
  countries?: CountryType[];
  disabled?: boolean;
  bg?: string;
  color?: string;
  isDark?: boolean;
}) => {
  const [states, setStates] = useState<StateType[]>([]);
  const [cities, setCities] = useState<CityType[]>([]);
  const handleCountryChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const country = countries?.find((item) => item._id === e.target.value);
    const newStates = await getOnlyData({
      url: `/locations/states?countryId=${country?.countryId}&sort=state`,
    });

    setStates(newStates.states);
  };

  const handleStateChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
    const currentState = states.find((item) => item._id === e.target.value);
    const newCities = await getOnlyData({
      url: `/locations/cities?stateId=${currentState?.stateId}&sort=city`,
    });

    setCities(newCities.cities);
  };

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
          {/* Country select input */}
          <FormGroup $height='4.4rem'>
            <SelectInput
              name='country'
              bg={bg || 'var(--grey)'}
              width='100%'
              disabled={disabled || false}
              onInputChange={handleCountryChange}
            >
              <option value='' hidden>
                select country
              </option>
              {countries?.map((item) => (
                <option value={item._id} key={item._id}>
                  {item.country}
                </option>
              ))}
            </SelectInput>
            <span className='a-icon'>
              <FaFlag />
            </span>
          </FormGroup>

          {/* State select input */}
          <FormGroup $height='4.4rem'>
            <SelectInput
              name='state'
              bg={bg || 'var(--grey)'}
              width='100%'
              disabled={disabled || false}
              onInputChange={handleStateChange}
            >
              <option value='' hidden>
                select state
              </option>
              {states?.map((item) => (
                <option value={item._id} key={item._id}>
                  {item.state}
                </option>
              ))}
            </SelectInput>
            <span className='a-icon'>
              <BiSolidCity />
            </span>
          </FormGroup>
          <FormGroup $height='4.4rem'>
            <SelectInput
              name='city'
              bg={bg || 'var(--grey)'}
              width='100%'
              disabled={disabled || false}
            >
              <option value='' hidden>
                select city
              </option>
              {cities.map((item) => (
                <option value={item._id} key={item._id}>
                  {item.city}
                </option>
              ))}
            </SelectInput>
            <span className='a-icon'>
              <FaTreeCity />
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
