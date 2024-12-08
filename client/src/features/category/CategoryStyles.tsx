import styled from 'styled-components';

const SectionWrapper = styled.section<{ $bg?: string; $grid?: number }>`
  background: url(${(props) => props.$bg}) no-repeat center;
  background-size: cover;
  padding-top: 5rem;
  padding-bottom: 2rem;
  margin-top: 2rem;
  .grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  @media screen and (min-width: 620px) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media screen and (min-width: 1024px) {
    background-position: unset;
    padding-top: 10rem;
    .grid {
      grid-template-columns: repeat(${(props) => props.$grid || 4}, 1fr);
    }
  }
`;
export default SectionWrapper;
