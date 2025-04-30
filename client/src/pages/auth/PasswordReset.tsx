import {
  ActionFunctionArgs,
  Form,
  useActionData,
  useNavigation,
} from 'react-router-dom';
import FormBox, { Header } from '../../features/authComponent/AuthStyles';
import Container from '../../ui/Container';
import PasswordInput from '../../features/authComponent/PasswordInput';
import Button from '../../ui/Button';
import { FaArrowDownUpLock } from 'react-icons/fa6';
import { extractFormData, updateData } from '../../api/requests';
import FormError from '../../ui/FormError';
import { InfoType } from '../../dtos/utilsDto';
import { Helmet } from 'react-helmet-async';

const PasswordReset = () => {
  const data = useActionData() as InfoType;
  const { state } = useNavigation();

  return (
    <>
      <Helmet>
        <title>MettyHair - Reset Password</title>
      </Helmet>
      <FormBox>
        <Container>
          <Header>
            <h4>Reset Password</h4>
          </Header>
          <Form id='form' method='post'>
            {data && <FormError info={data.message} />}
            <>
              <PasswordInput name='password' placeholder='New Password*' />
              <PasswordInput
                name='confirmPassword'
                placeholder='Confirm Password*'
              />
              <div style={{ marginTop: '4rem' }}>
                <Button
                  btnText={
                    state === 'submitting' ? 'Updating...' : 'Update Password'
                  }
                  icon={<FaArrowDownUpLock />}
                  disable={state === 'submitting'}
                />
              </div>
            </>
          </Form>
        </Container>
      </FormBox>
    </>
  );
};

export default PasswordReset;

// eslint-disable-next-line react-refresh/only-export-components
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await extractFormData(request);
  // This get the email and token from the URL.
  const urlData = Object.fromEntries([
    ...new URL(request.url).searchParams.entries(),
  ]);
  const data = { ...formData, ...urlData };

  return updateData({
    url: '/auth/reset-password',
    data,
    redirectTo: '/login',
    setToast: true,
  });
};
