import Container from '../../ui/Container';
import LinkBtn from '../../ui/LinkBtn';
import HeroSection from './HeroStyles';
import { useEffect, useState } from 'react';
import { SliderTypes } from '../../dtos/slidersDto';

const Hero = ({ slides }: { slides: SliderTypes[] }) => {
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    if (imageIndex < 0) {
      setImageIndex(slides.length - 1);
    }
    if (imageIndex > slides.length - 1) {
      setImageIndex(0);
    }
  }, [imageIndex, slides.length]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setImageIndex(imageIndex - 1);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [imageIndex]);

  return (
    <HeroSection>
      <Container type='relative'>
        <div className=' circle circle-1'></div>
        <div className='circle circle-2'></div>
        <div className='grid'>
          <div className='image-box'>
            {slides.map((item, index) => {
              const display = index === imageIndex ? 'show' : 'hidden';
              return (
                <img
                  src={item.image}
                  key={index}
                  className={display}
                  alt='product image'
                />
              );
            })}
          </div>
          <div className='msg-box'>
            {slides.map((item, index) => {
              const display = index === imageIndex ? 'show' : 'hidden';
              return (
                <article className={display} key={index}>
                  <h1>{item.title}</h1>
                  <p>{item.description}</p>
                </article>
              );
            })}
            <LinkBtn btnText='shop now' url='/products' type='white' />
          </div>
        </div>
      </Container>
    </HeroSection>
  );
};

export default Hero;
