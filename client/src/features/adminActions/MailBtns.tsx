import { IoMdMailOpen, IoMdMailUnread } from 'react-icons/io';
import { ActionBtnWrapper } from './ActionsBtns';
import { FaTrashAlt } from 'react-icons/fa';
import { useSubmit } from 'react-router-dom';

const MailBtns = ({ isRead, id }: { isRead: boolean; id: string }) => {
  const submit = useSubmit();
  const handDelete = () => {
    const proceed = window.confirm(
      'Are you sure you want to delete this mail?'
    );
    if (proceed) {
      const formData = new FormData();
      formData.append('id', id);
      submit(formData, { method: 'DELETE' });
    }
  };
  const handReadToggle = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const title = e.currentTarget.title.toLowerCase();
    const proceed = window.confirm(`Are you sure you want to ${title}?`);
    if (proceed) {
      const formData = new FormData();

      formData.append('id', id);
      formData.append('isRead', `${title === 'mark as read'}`);
      submit(formData, { method: 'PATCH' });
    }
  };

  return (
    <ActionBtnWrapper>
      <button title='Delete' className='btn-mail' onClick={handDelete}>
        <FaTrashAlt />
      </button>
      {isRead ? (
        <button
          title='Mark as unread'
          className='btn-mail'
          onClick={handReadToggle}
        >
          <IoMdMailUnread />
        </button>
      ) : (
        <button
          title='Mark as read'
          className='btn-mail'
          onClick={handReadToggle}
        >
          <IoMdMailOpen />
        </button>
      )}
    </ActionBtnWrapper>
  );
};

export default MailBtns;
