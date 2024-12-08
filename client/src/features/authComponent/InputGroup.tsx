import { FormGroup } from './AuthStyles';
import Input from '../../ui/Input';
import React from 'react';

type InputGroupType = {
  type: string;
  name: string;
  placeholder?: string;
  icon: React.ReactNode;
  mb?: string;
  disabled?: boolean;
  defaultValue?: string | number;
  hidden?: boolean;
  multiple?: boolean;
  isDark?: boolean;
  capitalize?: boolean;
};

const InputGroup = ({
  type,
  name,
  placeholder,
  icon,
  mb,
  disabled,
  defaultValue,
  hidden,
  multiple = false,
  isDark,
  capitalize,
}: InputGroupType) => {
  return (
    <FormGroup $mb={mb}>
      <Input
        id={name}
        type={type}
        name={name}
        placeholder={placeholder}
        autoComplete='false'
        disabled={disabled || false}
        // required
        defaultValue={defaultValue || ''}
        hidden={hidden || false}
        multiple={multiple || false}
        $dark={isDark}
        $capitalize={capitalize}
      />
      <span className='a-icon'>{icon}</span>
    </FormGroup>
  );
};

export default InputGroup;
