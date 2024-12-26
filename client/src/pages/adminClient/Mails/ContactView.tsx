/* eslint-disable react-refresh/only-export-components */
import styled from 'styled-components';
import { AdminSection } from '../../../features/adminNavLayouts/AdminUtils';
import { TabContentWrapper } from '../../../features/Tab/TabContentWrapper';
import {
  extractFormData,
  getData,
  postData,
  queryClient,
} from '../../../api/requests';
import {
  ActionFunctionArgs,
  Form,
  LoaderFunctionArgs,
  useLoaderData,
} from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Input from '../../../ui/Input';
import TextArea from '../../../ui/TextArea';
import { FaTrashAlt } from 'react-icons/fa';
import { useState } from 'react';

const MailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  color: var(--admin-sec-text-color);
  border-bottom: 1px solid var(--main-red-400);
  text-transform: capitalize;
  h4 {
    margin-bottom: 1rem;
  }
  .sender {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
`;
const MailBody = styled.div`
  color: var(--admin-sec-text-color);
  font-size: 1.4rem;
  white-space: pre-wrap;
  padding: 2rem 0;
`;

const Btn = styled.button`
  background-color: var(--main-red-100);
  border: none;
  border-radius: 1rem;
  color: var(--main-red-700);
  font-weight: 600;
  text-transform: capitalize;
  padding: 1rem 2rem;
  margin-top: 2rem;
  margin-right: 1rem;
`;

type ReplyTypes = {
  _id: string;
  contactId: string;
  replyMessage: string;
  replyDate: Date;
};

const ContactView = () => {
  const [isReply, setIsReply] = useState(false);
  const params = useLoaderData() as { id: string };

  const {
    data: { contact },
  } = useQuery({
    queryKey: ['fetchContact', 'contact', params.id],
    queryFn: () => getData({ url: `/contacts/${params.id}` }),
  });

  return (
    <AdminSection>
      <TabContentWrapper $dark={true}>
        <MailHeader>
          <div>
            <h4> {contact.subject} </h4>
            <span>{contact.fullName}</span>
            <div className='sender'>
              <span>from: </span>
              <span className='lowercase'>{contact.email}</span>
            </div>
          </div>
          <Btn onClick={() => setIsReply(true)}>reply</Btn>
        </MailHeader>
        <MailBody>{contact.message}</MailBody>
        {contact.replies.map((item: ReplyTypes) => {
          return (
            <div key={item._id}>
              {/* <h3>Your reply</h3> */}
              <MailHeader style={{ marginTop: '3rem' }}>
                <div>
                  <h4> {contact.subject} </h4>
                  <div className='sender'>
                    <span>to: </span>
                    <span className='lowercase'>{contact.email}</span>
                  </div>
                </div>
              </MailHeader>
              <MailBody>{item.replyMessage}</MailBody>
            </div>
          );
        })}
        <Btn onClick={() => setIsReply(true)} style={{ marginBottom: '1rem' }}>
          Reply
        </Btn>
        {/* Reply form */}
        {isReply && (
          <Form method='post' id='form'>
            <Input
              type='text'
              name='email'
              defaultValue={contact.email}
              disabled
              $dark
            />
            <TextArea
              name='message'
              rows={10}
              cols={10}
              $dark
              style={{ marginTop: '.2rem' }}
            ></TextArea>
            <Btn type='submit'>send</Btn>
            <Btn type='button' onClick={() => setIsReply(false)}>
              <FaTrashAlt />
            </Btn>
          </Form>
        )}
      </TabContentWrapper>
    </AdminSection>
  );
};

export default ContactView;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  await queryClient.ensureQueryData({
    queryKey: ['fetchContact', 'contact', params.id],
    queryFn: () => getData({ url: `/contacts/${params.id}` }),
  });
  return params;
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const { id } = params;
  const data = await extractFormData(request);
  console.log(data);

  return postData({
    url: `/contacts/${id}/contact-replies`,
    data,
    redirectTo: '/admin/contacts',
  });
};
