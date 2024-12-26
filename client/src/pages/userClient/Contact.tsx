/* eslint-disable react-refresh/only-export-components */
import { ActionFunctionArgs, Form, useActionData } from 'react-router-dom';
import { TwoGrid } from '../../features/adminNavLayouts/AdminUtils';
import Container from '../../ui/Container';
import Input, { Label } from '../../ui/Input';
import styled from 'styled-components';
import Heading from '../../ui/Heading';
import { useRef } from 'react';
import TextArea from '../../ui/TextArea';
import Button from '../../ui/Button';
import { MdMail, MdSend } from 'react-icons/md';
import { FaFacebook, FaInstagram, FaPhone, FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import {
  extractFormData,
  getData,
  postData,
  queryClient,
} from '../../api/requests';
import { useQuery } from '@tanstack/react-query';
import { InfoType } from '../../dtos/utilsDto';
import FormError from '../../ui/FormError';

const ContactFormBox = styled.div`
  background-color: var(--primary-white);
  border-radius: 2rem;
  padding: 1rem;
  .form {
    margin-top: 4rem;
  }
  .txt {
    text-align: center;
  }
  .group {
    position: relative;
    margin-top: 3rem;
  }
  .label {
    position: absolute;
    left: 2rem;
    top: 1rem;
    transition: var(--transition);
  }
  .active {
    left: 0;
    top: -2.1rem;
  }
`;

const DetailsBox = styled.div`
  display: flex;
  justify-content: center;
  .info h3 {
    color: var(--primary-color);
    margin-bottom: 2rem;
  }
  .info p {
    font-weight: 600;
    margin-bottom: 1.3rem;
  }
  .box {
    display: flex;
    align-items: center;
    gap: 3rem;
    font-size: 1.5rem;
    margin-top: 2rem;
    &:hover {
      color: var(--main-red-400);
    }
  }
  .break-word {
    word-break: break-word;
  }
`;

const Contact = () => {
  const emailRef = useRef(null);
  const nameRef = useRef(null);
  const messageRef = useRef(null);
  const subjectRef = useRef(null);
  // const submit = useSubmit();

  const info = useActionData() as InfoType;

  const { data } = useQuery({
    queryKey: ['setting'],
    queryFn: () => getData({ url: '/settings' }),
  });

  const settings = data.settings.at(0);

  const onFocusHandler = (
    e:
      | React.FocusEvent<HTMLInputElement, Element>
      | React.FocusEvent<HTMLTextAreaElement, Element>
  ) => {
    if (e.target.name === 'email' && emailRef.current) {
      (emailRef.current as HTMLInputElement).classList.add('active');
    }

    if (e.target.name === 'fullName' && nameRef.current) {
      (nameRef.current as HTMLInputElement).classList.add('active');
    }

    if (e.target.name === 'message' && messageRef.current) {
      (messageRef.current as HTMLInputElement).classList.add('active');
    }
    if (e.target.name === 'subject' && subjectRef.current) {
      (subjectRef.current as HTMLInputElement).classList.add('active');
    }
  };

  return (
    <Container style={{ paddingTop: '3rem' }}>
      <TwoGrid>
        <ContactFormBox>
          {/* <h4>Contact Us</h4> */}
          <Heading title='contact us' />
          <p className='txt'>We would like to hear from you.</p>
          <Form className='form' id='form' method='post'>
            {info && <FormError info={info.message} />}
            <div className='group'>
              <Label htmlFor='email' className='label' ref={emailRef}>
                email
              </Label>
              <Input
                type='email'
                id='email'
                name='email'
                onFocus={onFocusHandler}
                autoComplete='off'
              />
            </div>
            <div className='group'>
              <Label htmlFor='fullName' className='label' ref={nameRef}>
                full name
              </Label>
              <Input
                type='fullName'
                id='fullName'
                name='fullName'
                onFocus={onFocusHandler}
                autoComplete='off'
              />
            </div>
            <div className='group'>
              <Label htmlFor='subject' className='label' ref={subjectRef}>
                Subject
              </Label>
              <Input
                type='subject'
                id='subject'
                name='subject'
                onFocus={onFocusHandler}
                autoComplete='off'
              />
            </div>
            <div className='group'>
              <Label htmlFor='message' className='label' ref={messageRef}>
                message
              </Label>
              <TextArea
                rows={10}
                cols={10}
                onFocus={onFocusHandler}
                autoComplete='off'
                name='message'
                id='message'
              ></TextArea>
            </div>
            <div className='group'>
              <Button btnText='send' icon={<MdSend />} />
            </div>
          </Form>
        </ContactFormBox>
        <DetailsBox>
          <div className='info'>
            <h3>Metty General Merchant</h3>

            <p>Other ways you can reach us.</p>
            <div className='box'>
              <span>
                <FaPhone />
              </span>
              <Link to={`tel:${settings.contactPhone}`}>
                {settings.contactPhone}
              </Link>
            </div>
            <div className='box'>
              <span>
                <FaWhatsapp />
              </span>
              <span>{settings.contactPhone}</span>
            </div>
            <div className='box'>
              <span>
                <MdMail />
              </span>
              <Link
                to={`mailto:${settings.contactEmail}`}
                className='break-word'
              >
                {settings.contactEmail}
              </Link>
            </div>
            <div className='box'>
              <span>
                <FaFacebook />
              </span>
              <Link to={settings.facebook} className='break-word'>
                Facebook
              </Link>
            </div>
            <div className='box'>
              <span>
                <FaInstagram />
              </span>
              <Link to={settings.instagram} className='break-word'>
                Instagram
              </Link>
            </div>
          </div>
        </DetailsBox>
      </TwoGrid>
    </Container>
  );
};

export default Contact;

export const loader = () => {
  return queryClient.ensureQueryData({
    queryKey: ['setting'],
    queryFn: () => getData({ url: '/settings' }),
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await extractFormData(request);

  return postData({
    url: '/contacts',
    data,
    invalidate: ['fetchContact'],
  });
};
