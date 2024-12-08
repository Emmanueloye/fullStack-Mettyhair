import React, { useEffect, useState } from 'react';
import ProductImageWrapper from './ProductDetailsImageStyles';
import { ProductTypes } from '../../../dtos/productsDto';

const ProductDetailsImage = ({ product }: { product: ProductTypes }) => {
  const [imageSrc, setImageSrc] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setImageSrc(product.productImage);
  }, [product.productImage]);

  const handleClick = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    thumbnailIndex: number
  ) => {
    setImageSrc(e.currentTarget.src);
    setIndex(thumbnailIndex);
  };
  return (
    <ProductImageWrapper>
      <img src={imageSrc} alt={product.productName} className='product-img' />
      <div className='thumbnails'>
        <img
          src={product.productImage}
          alt={`${product.productName}-0`}
          onClick={(e) => handleClick(e, 0)}
          className={`${index === 0 ? 'active' : ''}`}
        />
        {product.thumbnails.map((thumbnail, i) => {
          return (
            <img
              key={i}
              src={thumbnail}
              alt={`${product.productName}-${i + 1}`}
              onClick={(e) => handleClick(e, i + 1)}
              className={`${index === i + 1 ? 'active' : ''}`}
            />
          );
        })}
      </div>
    </ProductImageWrapper>
  );
};

export default ProductDetailsImage;
