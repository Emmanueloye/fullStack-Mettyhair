import { MdShoppingCartCheckout, MdThumbUp } from 'react-icons/md';
import LinkBtn from '../../ui/LinkBtn';
import TotalWrapper from './ProductTotalStyles';
import { Header } from '../authComponent/AuthStyles';
import Button from '../../ui/Button';
import { FaRegCreditCard } from 'react-icons/fa';
import { formatNumber } from '../../utilities/HelperFunc';

// update to receive data dynamically.
const ProductTotal = ({
  productTotal,
  showHeader,
  marginTop,
  btnType = 'link',
  isOrder,
  isDark,
  hideBtn = false,
}: {
  showHeader: boolean;
  marginTop?: string;
  btnType?: string;
  isOrder?: boolean;
  isDark?: boolean;
  hideBtn?: boolean;
  productTotal: { subtotal: number; totalDiscount: number };
}) => {
  return (
    <TotalWrapper $mt={marginTop} $dark={isDark}>
      {showHeader && (
        <Header $mb='1rem'>
          <h4>cart total</h4>
        </Header>
      )}
      <div className='box'>
        <div className='cost-breakdown'>
          <div className='subtotal border'>
            <p>subtotal:</p>
            <p>&#8358; {formatNumber(productTotal.subtotal)}</p>
          </div>
          <div className='subtotal border'>
            <p>discount:</p>
            <p>
              &#8358;{' '}
              {productTotal.totalDiscount
                ? formatNumber(productTotal.totalDiscount)
                : '0.00'}
            </p>
          </div>
          {/* <div className='subtotal border-tick'>
            <p>VAT:</p>
            <p>&#8358; (500,000)</p>
          </div> */}
        </div>
        <div className='footer'>
          <div className='subtotal total'>
            <p>Total:</p>
            <p>
              &#8358;{' '}
              {formatNumber(productTotal.subtotal - productTotal.totalDiscount)}
            </p>
          </div>
          {btnType === 'link' ? (
            <LinkBtn
              btnText='proceed to checkout'
              url='/checkout'
              type='cart'
              icon={<MdShoppingCartCheckout />}
            />
          ) : (
            // can still make this a order cancel btn
            <div style={{ marginTop: '3rem' }}>
              {!hideBtn && (
                <Button
                  btnText={`${isOrder ? 'Thank you' : 'place order'}`}
                  icon={isOrder ? <MdThumbUp /> : <FaRegCreditCard />}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </TotalWrapper>
  );
};

export default ProductTotal;
