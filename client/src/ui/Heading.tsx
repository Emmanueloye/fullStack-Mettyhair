import styled from 'styled-components';
import underline from '../assets/images/Underline.png';

const Headline = styled.div`
  color: var(--primary-color);
  text-align: center;
  margin-bottom: 2rem;
  h4 {
    font-weight: 700;
    line-height: 1;
    text-transform: capitalize;
  }
`;
const Heading = ({ title }: { title: string }) => {
  return (
    <Headline>
      <h4>{title}</h4>
      <img src={underline} alt='underline' />
    </Headline>
  );
};

export default Heading;
