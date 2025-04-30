import styled from 'styled-components';
import LinkBtn from '../../ui/LinkBtn';
import { useEffect, useState } from 'react';
import { customFetch } from '../../api/requests';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
// import { ActionFunctionArgs, useSearchParams } from 'react-router-dom';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
`;

const VerifyEmail = () => {
  const [verifyMsg, setVerifyMsg] = useState({ status: '', message: '' });
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const sendEmailVerification = async () => {
      try {
        const data = Object.fromEntries(searchParams);

        const resp = await customFetch.post('/auth/verify-email', data);

        setVerifyMsg(resp.data);
      } catch (error) {
        setVerifyMsg(error as { status: string; message: string });
      }
    };

    sendEmailVerification();
  }, [searchParams]);
  return (
    <>
      <Helmet>
        <title>MettyHair - Signup</title>
      </Helmet>
      <Wrapper>
        <p>{verifyMsg?.message}</p>
        {verifyMsg.status === 'success' && (
          <LinkBtn btnText='login' url='/login' />
        )}
      </Wrapper>
    </>
  );
};

export default VerifyEmail;
