import styled from 'styled-components';

const CategoryCardWrapper = styled.article<{ $bg?: string }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: url(${(props) => props.$bg}) no-repeat center center;
  border-radius: var(--border-radius-sm);
  background-size: cover;
  text-align: center;
  position: relative;
  padding: 4rem 3rem;
  height: 30rem;
  .overlay {
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: var(--border-radius-sm);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    z-index: 2;
    img {
      display: block;
    }
  }
  h4 {
    text-transform: uppercase;
    color: var(--white);

    span {
      text-transform: capitalize;
    }
  }
  p {
    font-size: 1.4rem;
    text-align: center;
    text-transform: capitalize;
    color: var(--white);
    span {
      background-color: green;
      border-radius: var(--rounded);
      color: var(--primary-text-white);
      font-weight: 700;
      padding: 0rem 0.3rem;
      margin-right: 0.3rem;
    }
  }
`;
export default CategoryCardWrapper;
