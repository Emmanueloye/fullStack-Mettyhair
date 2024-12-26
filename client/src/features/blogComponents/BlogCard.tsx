import img from '../../assets/images/hair2.webp';
import LinkBtn from '../../ui/LinkBtn';
import Card from '../products/ProductCardStyles';
import { Center } from '../Tab/TabContentWrapper';

const BlogCard = () => {
  return (
    <Card style={{ borderRadius: '1rem' }}>
      <div className='card-header'>
        <img src={img} alt='' style={{ borderRadius: '1rem' }} />
      </div>
      <div className='card-body'>
        <h5 className='card-title'>Blog Title</h5>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor, fugit.
        </p>
        <Center>
          <LinkBtn btnText='read more' url='/blog/slug/1' mt='1rem' />
        </Center>
      </div>
    </Card>
  );
};

export default BlogCard;
