import Button from '../../../ui/Button';
import Rating from '../../../ui/Rating';
import { formatNumber } from '../../../utilities/HelperFunc';
import { IoMdCart } from 'react-icons/io';
import { FcMoneyTransfer } from 'react-icons/fc';
import { Link } from 'react-router-dom';
import ProductInfoWrapper from './ProductDetailsInfoStyles';
import SelectInput from '../../../ui/SelectInput';
import { ProductTypes } from '../../../dtos/productsDto';
import { postData } from '../../../api/requests';
import { toast } from 'react-toastify';

const ProductDetailsInfo = ({ product }: { product: ProductTypes }) => {
  // Handle add to cart
  const handleAddToCart = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formInputs = Object.fromEntries(formData);

    const cartId = localStorage.getItem('xctid');
    const data = {
      product: product._id,
      cartId: cartId ? cartId : null,
      ...formInputs,
    };

    const resp = await postData({
      url: `/carts`,
      data,
      invalidate: ['fetchCart'],
    });
    if (resp.status === 'success') {
      toast.success(resp.message);
      if (resp.cartId) localStorage.setItem('xctid', resp.cartId);
    } else {
      toast.error(resp.message);
    }
  };
  return (
    <form id='form' onSubmit={handleAddToCart}>
      <ProductInfoWrapper>
        <h3 className='pname'>{product.productName}</h3>
        {/* Rating */}
        <Rating
          showNumReview={true}
          productRating={product.averageRating}
          numReview={product.numOfReview ? product.numOfReview : 'no'}
        />
        {/* Prices */}
        {product.discountPrice ? (
          <div className='pricing'>
            <span className='sprice'>
              &#8358;{formatNumber(Number(product.discountPrice))}
            </span>
            <span className='dprice'>
              &#8358;{formatNumber(product.sellingPrice)}
            </span>
          </div>
        ) : (
          <div className='pricing'>
            <span className='sprice'>
              &#8358;{formatNumber(Number(product.sellingPrice))}
            </span>
          </div>
        )}
        {/* Product short description */}
        <p className='desc'>{product.shortDesc}</p>

        {/* Product status */}
        <div className='status'>
          <span>Status: </span>
          <span className={product.quantity === 0 ? 'stockout' : 'available'}>
            {product.quantity === 0 ? 'Stock out' : 'Available'}
          </span>
        </div>

        <div className='action'>
          {/* Quantity, color and length boxes */}
          <div className='options'>
            <div>
              <label htmlFor='qty'>Quantity</label>
              <input
                id='qty'
                type='Number'
                min={1}
                defaultValue={1}
                max={product.quantity}
                className='input'
                name='quantity'
              />
            </div>

            {/* color */}
            <SelectInput name='color' bg='var(--white)'>
              {product.color.split(',').map((item, index) => (
                <option value={item} key={index}>
                  {item}
                </option>
              ))}
            </SelectInput>
            {/* length */}
            {product?.size && (
              <SelectInput name='size' bg='var(--white)'>
                {product.size?.split(',').map((item, index) => (
                  <option value={item} key={index}>
                    {item}
                  </option>
                ))}
              </SelectInput>
            )}
          </div>
          {/* Add to cart and buy now button. */}
          <div className='btn'>
            <Button
              btnText='add to cart'
              icon={<IoMdCart />}
              marginBottom='2rem'
              type='submit'
            />
            <Link to='/'>
              <Button
                btnText='Buy now'
                icon={<FcMoneyTransfer />}
                bg='var(--main-red-400)'
                color='var(--main-light-blue)'
              />
            </Link>
          </div>
        </div>
      </ProductInfoWrapper>
    </form>
  );
};

export default ProductDetailsInfo;
