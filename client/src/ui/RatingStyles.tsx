import styled from 'styled-components';

// Styles
const RatingWrapper = styled.div<{ $color?: string; $size?: string }>`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  .group {
    display: flex;
    gap: 0.3rem;
  }
  .icon {
    color: ${(props) => (props.$color ? props.$color : 'var(--primary-color)')};
    font-size: ${(props) => (props.$size ? props.$size : '1.9rem')};
  }
  .rate {
    font-weight: normal;
    span {
      font-weight: 600;
    }
  }
`;

export default RatingWrapper;
