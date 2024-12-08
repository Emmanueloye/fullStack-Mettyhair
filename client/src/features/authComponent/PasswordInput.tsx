import { RiLockPasswordFill } from 'react-icons/ri';
import Input from '../../ui/Input';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useRef } from 'react';
import { FormGroup, PasswordIcon } from './AuthStyles';

const PasswordInput = ({
  name,
  placeholder,
}: {
  name: string;
  placeholder: string;
}) => {
  const eyeRef = useRef<HTMLSpanElement>(null);
  const eyeSplashRef = useRef<HTMLSpanElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleShow = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (passwordRef.current) {
      const isHidden = e.currentTarget.classList.contains('eye');
      passwordRef.current.type = isHidden ? 'text' : 'password';
      eyeRef.current!.classList.toggle('hidden');
      eyeSplashRef.current!.classList.toggle('hidden');
    }
  };
  return (
    <FormGroup>
      <Input
        id={name}
        type='password'
        name={name}
        placeholder={placeholder}
        ref={passwordRef}
        // required
        autoComplete='false'
      />
      <span className='a-icon'>
        <RiLockPasswordFill />
      </span>
      <PasswordIcon className='eye' ref={eyeRef} onClick={handleShow}>
        <FaEye />
      </PasswordIcon>
      <PasswordIcon className='hidden' ref={eyeSplashRef} onClick={handleShow}>
        <FaEyeSlash />
      </PasswordIcon>
    </FormGroup>
  );
};

export default PasswordInput;
