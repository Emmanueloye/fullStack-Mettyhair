import {
  ActionFunctionArgs,
  Form,
  useActionData,
  useNavigation,
} from 'react-router-dom';
import FormBox, { Header } from '../../features/authComponent/AuthStyles';
import Container from '../../ui/Container';
import InputGroup from '../../features/authComponent/InputGroup';
import { MdMail } from 'react-icons/md';
import Button from '../../ui/Button';
import { TbLockQuestion } from 'react-icons/tb';
import { extractFormData, postData } from '../../api/requests';
import FormError from '../../ui/FormError';
import { InfoType } from '../../dtos/utilsDto';
import { Helmet } from 'react-helmet-async';

const ForgetPassword = () => {
  const data = useActionData() as InfoType;
  const { state } = useNavigation();

  return (
    <>
      <Helmet>
        <title>MettyHair - Forget Password</title>
      </Helmet>
      <FormBox>
        <Container>
          <Header>
            <h4>Forget Password</h4>
          </Header>
          <Form method='post'>
            {data && <FormError info={data.message} />}
            <>
              <InputGroup
                type='email'
                name='email'
                placeholder='Email*'
                icon={<MdMail />}
              />

              <div style={{ marginTop: '4rem' }}>
                <Button
                  btnText={
                    state === 'submitting'
                      ? 'Sending Reset Link...'
                      : 'Password Reset Link'
                  }
                  icon={<TbLockQuestion />}
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

export default ForgetPassword;

// eslint-disable-next-line react-refresh/only-export-components
export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await extractFormData(request);
  return postData({ url: '/auth/forget-password', data });
};
