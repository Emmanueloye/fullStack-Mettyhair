import { Link } from 'react-router-dom';
import Icon from './Icon';
import { IoMdCart } from 'react-icons/io';
import BtnLinkWrapper from './LinkBtnStyles';

type LinkBtnProps = {
  btnText: string | React.ReactNode;
  url: string;
  type?: string;
  mt?: string;
  icon?: React.ReactNode;
};

const LinkBtn = ({ btnText, url, type, mt, icon }: LinkBtnProps) => {
  return (
    <BtnLinkWrapper type={type} $mt={mt}>
      <Link to={url} className='btn-link'>
        {btnText}
      </Link>
      {type === 'cart' && (
        <span className='cart-icon'>
          <Icon icon={icon || <IoMdCart />} />
        </span>
      )}
    </BtnLinkWrapper>
  );
};

export default LinkBtn;
