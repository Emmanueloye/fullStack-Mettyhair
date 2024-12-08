import { CartTypes } from '../../dtos/productsDto';
import { formatNumber } from '../../utilities/HelperFunc';
import OrderSummaryWrapper from './OrderSummaryStyles';

const OrderSummary = ({
  isDark,
  cart,
}: {
  isDark?: boolean;
  cart: CartTypes;
}) => {
  // Alternate between selling and discount price if there is discount price.
  const price = cart.product.discountPrice
    ? cart.product.discountPrice
    : cart.product.sellingPrice;

  return (
    <OrderSummaryWrapper $dark={isDark}>
      <div className='order'>
        <div className='img-box'>
          <img
            src={cart.product.productImage}
            alt={cart.product.productName}
            width={50}
            height={50}
          />
        </div>
        <div className='order-name'>
          <h5>{`${cart.product.productName.substring(0, 14)}...`}</h5>
          <p>
            {cart.quantity} x &#8358;
            {formatNumber(price)}
          </p>
        </div>
      </div>
      <p className='subtotal'>&#8358;{formatNumber(cart.quantity * price)}</p>
    </OrderSummaryWrapper>
  );
};

export default OrderSummary;
