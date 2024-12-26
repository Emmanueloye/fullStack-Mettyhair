import styled from 'styled-components';
import img from '../../assets/images/hair2.webp';
import Container from '../../ui/Container';
import LinkBtn from '../../ui/LinkBtn';

export const BlogDetailsBox = styled.div`
  padding-top: 4rem;
  .img {
    width: 30rem;
    height: 30rem;
    float: left;
    margin-right: 2rem;
    object-fit: fill;
  }
  .title {
    color: var(--main-red-600);
    text-transform: capitalize;
  }
  .small {
    font-weight: 500;
    margin-bottom: 2rem;
    span:first-child {
      font-weight: 600;
    }
  }
`;

const BlogDetails = () => {
  return (
    <BlogDetailsBox>
      <Container>
        <img src={img} alt='blog image' className='img' />
        <div className='main'>
          <h3 className='title'>How to keep your curly hairs shining.</h3>

          <div className='small'>
            <span>Created Date: </span>
            <span>March 2, 2024</span>
          </div>

          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos optio,
            perspiciatis dicta accusantium quod libero necessitatibus officia
            temporibus delectus voluptates. Consequatur, amet sit id enim
            aspernatur, dolorem illum ab quod aliquid laborum placeat cumque ad.
            Perferendis qui tempore illo quod doloribus dolore ducimus
            consequuntur corporis ipsum inventore voluptatum architecto magnam
            ex mollitia eaque est quidem nulla necessitatibus numquam, molestiae
            excepturi?
          </p>
          <br />
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos optio,
            perspiciatis dicta accusantium quod libero necessitatibus officia
            temporibus delectus voluptates. Consequatur, amet sit id enim
            aspernatur, dolorem illum ab quod aliquid laborum placeat cumque ad.
            Perferendis qui tempore illo quod doloribus dolore ducimus
            consequuntur corporis ipsum inventore voluptatum architecto magnam
            ex mollitia eaque est quidem nulla necessitatibus numquam, molestiae
            excepturi?
          </p>
          <br />
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos optio,
            perspiciatis dicta accusantium quod libero necessitatibus officia
            temporibus delectus voluptates. Consequatur, amet sit id enim
            aspernatur, dolorem illum ab quod aliquid laborum placeat cumque ad.
            Perferendis qui tempore illo quod doloribus dolore ducimus
            consequuntur corporis ipsum inventore voluptatum architecto magnam
            ex mollitia eaque est quidem nulla necessitatibus numquam, molestiae
            excepturi?
          </p>
        </div>
        <LinkBtn btnText='back to main blog' url='/blog' />
      </Container>
    </BlogDetailsBox>
  );
};

export default BlogDetails;
