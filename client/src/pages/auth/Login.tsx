import {
  ActionFunctionArgs,
  Form,
  Link,
  useActionData,
  useNavigate,
  useNavigation,
} from 'react-router-dom';
import { MdMail } from 'react-icons/md';
import { BiSolidLogInCircle } from 'react-icons/bi';
import FormBox, {
  AuthAction,
  Header,
} from '../../features/authComponent/AuthStyles';
import Container from '../../ui/Container';
import InputGroup from '../../features/authComponent/InputGroup';
import PasswordInput from '../../features/authComponent/PasswordInput';
import Button from '../../ui/Button';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import FormError from '../../ui/FormError';
import { customFetch, extractFormData, queryClient } from '../../api/requests';
import axios from 'axios';
import { useEffect } from 'react';
import { authActions } from '../../store/authAction';
import { toast } from 'react-toastify';

type ErrorType = { message: string; status: string };

const Login = () => {
  // Set the verification message on login page from register page.
  const { info } = useAppSelector((state) => state.auth);

  const error = useActionData() as ErrorType;
  const dispatch = useAppDispatch();
  const { state } = useNavigation();
  const navigate = useNavigate();

  // Check the status of login request and update whether user is logged in or not.
  useEffect(() => {
    if (error?.status === 'fail') {
      dispatch(authActions.updateAuthStatus(''));
    }
    if (error?.status === 'success') {
      dispatch(authActions.updateAuthStatus(true));
      navigate('/');
    }
  }, [dispatch, error, navigate]);

  return (
    <FormBox>
      <Container>
        {info && <FormError info={info} />}
        <Header>
          <h4>Login</h4>
        </Header>
        <Form method='post'>
          {error && error.status === 'fail' && (
            <FormError info={error.message} />
          )}
          {/* Email input group */}
          <InputGroup
            type='email'
            name='email'
            placeholder='Email*'
            icon={<MdMail />}
          />
          {/* Password input group */}
          <PasswordInput name='password' placeholder='Password*' />

          {/* Register link */}
          <AuthAction>
            <span>Don't have an account?</span>
            <Link to='/register'>Register here.</Link>
          </AuthAction>
          {/* forget password link */}
          <AuthAction>
            <Link to='/forget-password'>Forgot password</Link>
          </AuthAction>
          <div style={{ marginTop: '4rem' }}>
            <Button
              btnText={state === 'submitting' ? 'Logging in...' : 'Login'}
              icon={<BiSolidLogInCircle />}
              disable={state === 'submitting'}
              type='submit'
            />
          </div>
        </Form>
      </Container>
    </FormBox>
  );
};

export default Login;

// eslint-disable-next-line react-refresh/only-export-components
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await extractFormData(request);
  try {
    const resp = await customFetch.post('/auth/login', formData);
    queryClient.invalidateQueries();
    toast.success('You are now logged in.');
    return resp.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error?.response?.data;
    }
  }
};
