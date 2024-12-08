import Container from '../../ui/Container';
import LinkBtn from '../../ui/LinkBtn';
import HeroSection from './HeroStyles';
import { SliderTypes } from '../../dtos/slidersDto';

const AdminHero = ({
  slide,
  padding = false,
}: {
  slide: SliderTypes;
  padding?: boolean;
}) => {
  return (
    <HeroSection>
      <Container type='relative' $padding={padding}>
        <div className=' circle circle-1'></div>
        <div className='circle circle-2'></div>
        <div className='grid'>
          <div className='image-box'>
            <img src={slide.image} alt='product image' />
          </div>
          <div className='msg-box'>
            <article>
              <h1>{slide.title}</h1>
              <p>{slide.description}</p>
            </article>

            <LinkBtn
              btnText='Back to Sliders'
              url='/admin/sliders'
              type='white'
            />
          </div>
        </div>
      </Container>
    </HeroSection>
  );
};

export default AdminHero;
