import { Link } from 'react-router-dom';
import Button from '../../ui/Button';
import Card from './ProductCardStyles';
import { formatNumber } from '../../utilities/HelperFunc';
import { IoMdCart } from 'react-icons/io';
import { ProductTypes } from '../../dtos/productsDto';
import { postData } from '../../api/requests';
import { toast } from 'react-toastify';

const ProductCard = ({
  product,
  className,
}: {
  product: ProductTypes;
  className?: string;
}) => {
  const productName =
    product.productName?.length > 21
      ? `${product.productName.slice(0, 19)}...`
      : product.productName;

  const handleAddToCart = async () => {
    const cartId = localStorage.getItem('xctid');
    const data = {
      product: product._id,
      quantity: 1,
      size: product.size?.split(',')[0],
      color: product.color.split(',')[0],
      cartId: cartId ? cartId : null,
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
    <Card className={className}>
      <Link to={`/products/${product?.slug}/${product?._id}`}>
        <div className='card-header'>
          <img src={product?.productImage} alt='product image' />
        </div>
        <div className='card-body'>
          <h5 className='card-title'>{productName}</h5>

          <div className='pricing'>
            {product?.discountPrice ? (
              <>
                <p>&#8358;{formatNumber(product?.sellingPrice)}</p>
                <p>&#8358;{formatNumber(product?.discountPrice)}</p>
              </>
            ) : (
              <>
                <p>-</p>
                <p>&#8358;{formatNumber(product?.sellingPrice)}</p>
              </>
            )}
          </div>
        </div>
      </Link>

      <Button
        btnText='add to cart'
        icon={<IoMdCart />}
        onBtnTrigger={handleAddToCart}
      />
    </Card>
  );
};

export default ProductCard;
