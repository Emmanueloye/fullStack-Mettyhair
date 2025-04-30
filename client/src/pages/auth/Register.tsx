import {
  ActionFunctionArgs,
  Form,
  useActionData,
  useNavigate,
  useNavigation,
} from 'react-router-dom';
import FormBox, {
  AuthAction,
  Header,
} from '../../features/authComponent/AuthStyles';
import Container from '../../ui/Container';
import InputGroup from '../../features/authComponent/InputGroup';
import { FaUserAlt } from 'react-icons/fa';
import { MdMail } from 'react-icons/md';
import PasswordInput from '../../features/authComponent/PasswordInput';
import { Link } from 'react-router-dom';
import Button from '../../ui/Button';
import { IoCreate } from 'react-icons/io5';
import { extractFormData, postData, queryClient } from '../../api/requests';
import FormError from '../../ui/FormError';
import { useAppDispatch } from '../../store/hook';
import { useEffect } from 'react';
import { authActions } from '../../store/authAction';
import { InfoType } from '../../dtos/utilsDto';
import { Helmet } from 'react-helmet-async';

const Register = () => {
  const data = useActionData();
  const dispatch = useAppDispatch();
  const { state } = useNavigation();
  const navigate = useNavigate();

  useEffect(() => {
    if ((data as InfoType)?.status === 'success') {
      const message = { message: (data as InfoType)?.message };

      dispatch(authActions.loginSuccess(message));
      navigate('/login');
    }
  }, [data, dispatch, navigate]);

  return (
    <>
      <Helmet>
        <title>MettyHair - Signup</title>
      </Helmet>
      <FormBox>
        <Container>
          <Header>
            <h4>Register</h4>
          </Header>
          <Form method='post'>
            {(data as InfoType)?.status === 'fail' && (
              <FormError info={(data as InfoType)?.message} />
            )}
            <>
              <InputGroup
                type='text'
                name='fullName'
                placeholder='Full Name'
                icon={<FaUserAlt />}
              />
              <InputGroup
                type='email'
                name='email'
                placeholder='Email*'
                icon={<MdMail />}
              />
              <PasswordInput name='password' placeholder='Password*' />
              <PasswordInput
                name='confirmPassword'
                placeholder='Confirm Password*'
              />
              <AuthAction>
                <span>Already have an account?</span>
                <Link to='/login'>Login here.</Link>
              </AuthAction>
              <div style={{ marginTop: '4rem' }}>
                <Button
                  btnText={state === 'submitting' ? 'Creating...' : 'Register'}
                  icon={<IoCreate />}
                  disable={state === 'submitting'}
                  type='submit'
                />
              </div>
            </>
          </Form>
        </Container>
      </FormBox>
    </>
  );
};

export default Register;

// eslint-disable-next-line react-refresh/only-export-components
export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await extractFormData(request);
  const resp = postData({ url: '/auth/signup', data });
  queryClient.invalidateQueries();
  return resp;
};
