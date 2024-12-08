import { OrderItemType } from '../../dtos/orderDto';
import { formatNumber } from '../../utilities/HelperFunc';
import OrderSummaryWrapper from './OrderSummaryStyles';

const OrderSum = ({
  isDark,
  orderItem,
}: {
  isDark?: boolean;
  orderItem: OrderItemType;
}) => {
  return (
    <OrderSummaryWrapper $dark={isDark}>
      <div className='order'>
        <div className='img-box'>
          <img
            src={orderItem.productId.productImage}
            alt={orderItem.productId.productName}
            width={50}
            height={50}
          />
        </div>
        <div className='order-name'>
          <h5>{`${orderItem.productId.productName.substring(0, 14)}...`}</h5>
          <p>
            {orderItem.quantity} x &#8358;
            {formatNumber(orderItem.price)}
          </p>
        </div>
      </div>
      <p className='subtotal'>
        &#8358;{formatNumber(orderItem.quantity * orderItem.price)}
      </p>
    </OrderSummaryWrapper>
  );
};

export default OrderSum;
