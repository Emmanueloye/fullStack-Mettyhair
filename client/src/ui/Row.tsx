import styled from 'styled-components';
import Container from './Container';

const Row = styled(Container)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

export default Row;
