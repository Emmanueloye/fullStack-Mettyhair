import { BlogTypes } from '../../dtos/blogDto';
import LinkBtn from '../../ui/LinkBtn';
import { slugifyText } from '../../utilities/HelperFunc';
import Card from '../products/ProductCardStyles';
import { Center } from '../Tab/TabContentWrapper';

const BlogCard = ({ post }: { post: BlogTypes }) => {
  const title =
    post.title.length <= 35 ? post.title : `${post.title.substring(0, 32)}...`;
  const content =
    post.content.length < 100
      ? post.content
      : `${post.content.substring(0, 97)}...`;
  return (
    <Card style={{ borderRadius: '1rem' }}>
      <div className='card-header'>
        <img
          src={post.image}
          alt={post.title}
          style={{ borderRadius: '1rem' }}
        />
      </div>
      <div className='card-body'>
        <h5
          className='card-title'
          title={post.title}
          style={{ cursor: 'pointer' }}
        >
          {title}
        </h5>
        <p>{content}</p>
        <Center>
          <LinkBtn
            btnText='read more'
            url={`/blog/${slugifyText(post.title)}/${post._id}`}
            mt='1rem'
          />
        </Center>
      </div>
    </Card>
  );
};

export default BlogCard;
