import { Link, useSubmit } from 'react-router-dom';
import { ActionBtnWrapper } from './ActionsBtns';
import { FaEye } from 'react-icons/fa';
import { MdThumbDownAlt, MdThumbUpAlt } from 'react-icons/md';

const OrderActions = ({
  id,
  viewURL,
  showView = true,
  showApproved = true,
  showDisapproved = false,
  showBoth = false,
  orderStatus,
}: {
  id: string;
  viewURL: string;
  showView?: boolean;
  showApproved?: boolean;
  showDisapproved?: boolean;
  showBoth?: boolean;
  orderStatus?: string;
}) => {
  // to handle form submission pragmatically.
  const submit = useSubmit();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // alart notification if the user wants to continue.
    const proceed = window.confirm('Are you sure you want to proceed?');
    if (proceed) {
      const formData = new FormData();

      formData.append('id', id);
      // Gets the title of closest button to the element clicked.
      const target = e.currentTarget.closest('button')?.title;
      // For order approvals and rejection
      if (target?.toLowerCase() === 'approve' && orderStatus === 'pending') {
        formData.append('orderStatus', 'confirmed');
      } else if (
        target?.toLowerCase() === 'approve' &&
        orderStatus === 'confirmed'
      ) {
        formData.append('orderStatus', 'delivered');
      } else if (
        target?.toLowerCase() === 'reject' &&
        orderStatus === 'confirmed'
      ) {
        formData.append('orderStatus', 'pending');
      } else {
        // for none order approval and rejection.
        formData.append('isApproved', `${target?.toLowerCase() === 'approve'}`);
      }

      // Submit the form.
      submit(formData, { method: 'PATCH' });
    }
  };
  return (
    <ActionBtnWrapper>
      <>
        {showView && (
          <Link to={viewURL} title='View' className='btn-blue'>
            <FaEye />
          </Link>
        )}

        <>
          {showApproved && (
            <button title='Approve' onClick={handleClick}>
              <MdThumbUpAlt />
            </button>
          )}
          {showDisapproved && (
            <>
              <button title='Reject' onClick={handleClick}>
                <MdThumbDownAlt />
              </button>
            </>
          )}
          {showBoth && (
            <>
              <button title='Approve' onClick={handleClick}>
                <MdThumbUpAlt />
              </button>
              <button title='Reject' onClick={handleClick}>
                <MdThumbDownAlt />
              </button>
            </>
          )}

          {/* {showDisapproved && (
            <button title='Reject'>
              <MdThumbDownAlt />
            </button>
          )} */}
        </>
      </>
    </ActionBtnWrapper>
  );
};

export default OrderActions;
