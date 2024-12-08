import { QtyWrapper } from '../../ui/QuantityBox';
import { FaTrash } from 'react-icons/fa';
import CartBox from './CartProductStyle';
import { formatNumber } from '../../utilities/HelperFunc';
import { Link } from 'react-router-dom';
import { CartTypes } from '../../dtos/productsDto';
import { deleteData, updateData } from '../../api/requests';
import { toast } from 'react-toastify';
import { useState } from 'react';

const CartProduct = ({ cart }: { cart: CartTypes }) => {
  const [isDecreaseLoading, setIsDecreaseLoading] = useState(false);
  const [isIncreaseLoading, setIsIncreaseLoading] = useState(false);
  const [isDeletingLoading, setIsDeletingLoading] = useState(false);
  const price = cart.product.discountPrice
    ? cart.product.discountPrice
    : cart.product.sellingPrice;

  // Handle reduction in cart quantity
  const handleDecrease = async () => {
    if (cart.quantity === 1) {
      toast.error('Cart quantity cannot be less than one(1).');
      return;
    }
    setIsDecreaseLoading(true);
    await updateData({
      url: `/carts/${cart._id}`,
      data: { quantity: cart.quantity - 1 },
      invalidate: ['fetchCart'],
    });
    setIsDecreaseLoading(false);
  };

  // Handle Increment in cart quantity
  const handleIncrease = async () => {
    if (cart.quantity >= cart.product.quantity) {
      toast.error('Cart quantity cannot be more than the available quantity.');
      return;
    }
    setIsIncreaseLoading(true);
    await updateData({
      url: `/carts/${cart._id}`,
      data: { quantity: cart.quantity + 1 },
      invalidate: ['fetchCart'],
    });
    setIsIncreaseLoading(false);
  };

  // Handle cart delete.
  const handleDelete = async () => {
    setIsDeletingLoading(true);
    await deleteData({ url: `/carts/${cart._id}`, invalidate: ['fetchCart'] });
    setIsDeletingLoading(false);
  };

  return (
    <CartBox>
      <div className='product'>
        <img
          src={cart.product.productImage}
          alt='product image'
          width={50}
          height={50}
        />
        <div className='product-info'>
          <Link to={`/products/${cart.product.slug}/${cart.product._id}`}>
            <h4>{cart.product.productName}</h4>
          </Link>
          <p>
            Color: <span>{cart.color}</span>
          </p>
          <p>Length: {cart.size}</p>
        </div>
      </div>
      <div className='price'>
        {cart.product.discountPrice ? (
          <>
            <p className='fade-price'>
              &#8358;
              {formatNumber(cart.product.sellingPrice)}
            </p>
            <p>
              &#8358;
              {formatNumber(cart.product.discountPrice)}
            </p>
          </>
        ) : (
          <p>
            &#8358;
            {formatNumber(cart.product.sellingPrice)}
          </p>
        )}
      </div>
      <div className='qty'>
        <QtyWrapper>
          <button onClick={handleDecrease}>
            {isDecreaseLoading ? '...' : '-'}
          </button>
          <input type='text' value={cart.quantity} disabled />
          <button onClick={handleIncrease} disabled={isIncreaseLoading}>
            {isIncreaseLoading ? '...' : '+'}
          </button>
        </QtyWrapper>
      </div>
      <div className='total'>
        <p>&#8358;{formatNumber(price * cart.quantity)}</p>
      </div>
      <div className='delete' onClick={handleDelete}>
        {isDeletingLoading ? '...' : <FaTrash />}
      </div>
    </CartBox>
  );
};

export default CartProduct;
