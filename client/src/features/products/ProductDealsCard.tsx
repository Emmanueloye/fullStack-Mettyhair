import LinkBtn from '../../ui/LinkBtn';
import DealCardWrapper from './ProductDealsCardStyles';

// temp image
import img from '../../assets/images/hair2.webp';

type TypeProps = 'withImage' | 'noImage';

const ProductDealsCard = ({ type, url }: { type: TypeProps; url: string }) => {
  return (
    <DealCardWrapper type={type}>
      <div className='product-deals-text'>
        <h4>End of season deal</h4>
        <p>20% OFF on our luxury hairs</p>
        <LinkBtn btnText='shop now' url={url} type='white' mt='1rem' />
      </div>

      <div className='product-deals-img'>
        <img src={img} alt='image' />
      </div>
    </DealCardWrapper>
  );
};

export default ProductDealsCard;
