import bg from '../../assets/images/DeskopCatBg.png';
import styled from 'styled-components';
import ProductDealsCard from './ProductDealsCard';
import Container from '../../ui/Container';

const DealSectionWrapper = styled.section<{ $bg?: string }>`
  background: url(${(props) => props.$bg}) no-repeat center;
  background-size: cover;
  padding-top: 6rem;
  padding-bottom: 2rem;
  margin-top: 2rem;
  margin-bottom: 3rem;
  .grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  @media screen and (min-width: 740px) {
    background-position: unset;
    .grid {
      grid-template-columns: 2fr 1fr;
    }
  }
`;

const SpecialDeal = () => {
  return (
    <DealSectionWrapper className='scaleIn' $bg={bg}>
      <Container>
        <div className='grid'>
          <ProductDealsCard type='withImage' url='/products/special-offer' />
          <ProductDealsCard type='noImage' url='/products/special-offer' />
        </div>
      </Container>
    </DealSectionWrapper>
  );
};

export default SpecialDeal;
