import img from '../../assets/images/blackhair.png';
import Container from '../../ui/Container';
import LinkBtn from '../../ui/LinkBtn';
import { BlogHeroBox } from './BlogHeroStyles';

const BlogHero = () => {
  return (
    <BlogHeroBox>
      <Container>
        <div className='hero-txt'>
          <div className='inner-text'>
            <h1>Mettyhair Blog</h1>
            <p>
              Providing value and ensuring you get the best out of your hair.
            </p>
            <LinkBtn btnText='Learn more' url='#blog' />
          </div>
        </div>
        <div>
          <img
            src={img}
            alt=''
            width={200}
            height={200}
            className='img img-1'
          />
          <img
            src={img}
            alt=''
            width={200}
            height={200}
            className='img img-2'
          />
          <img
            src={img}
            alt=''
            width={200}
            height={200}
            className='img img-3'
          />
          <img
            src={img}
            alt=''
            width={200}
            height={200}
            className='img img-4'
          />
        </div>
      </Container>
    </BlogHeroBox>
  );
};

export default BlogHero;
