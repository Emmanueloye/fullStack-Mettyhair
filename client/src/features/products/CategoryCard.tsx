import LinkBtn from '../../ui/LinkBtn';
import CategoryCardWrapper from './CategoryCardStyles';
import underline from '../../assets/images/whiteUnderline.png';

// Temp import. To be obtained dynamically.
// import img from '../../assets/images/nobgHair.png';

export type CategoryCardProps = {
  image: string;
  category: string;
  text?: string;
  url: string;
};

const CategoryCard = ({ image, category, text, url }: CategoryCardProps) => {
  return (
    <CategoryCardWrapper $bg={image}>
      <div className='overlay'></div>
      <div className='box'>
        <h4>
          {category}
          {/* <span>{category?.split(' ').slice(1).join(' ')}</span> */}
        </h4>
        <p>
          <span>&#x2713;</span>
          {text}
        </p>
        <img src={underline} alt='underline' />
        <LinkBtn btnText='shop now' url={url} mt='5rem' />
      </div>
    </CategoryCardWrapper>
  );
};

export default CategoryCard;
