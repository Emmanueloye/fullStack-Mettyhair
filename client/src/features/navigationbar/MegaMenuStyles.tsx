import styled from 'styled-components';

export const MenuWrapper = styled.aside<{ $show?: boolean }>`
  background-color: var(--main-red-700);
  position: absolute;
  top: 4.5rem;
  left: 50%;
  transform: translate(-42%);
  padding: 1rem;
  z-index: 1000;
  display: ${(props) => (props.$show ? 'block' : 'none')};
  width: 80vw;
  transition: var(--transition);
  @media screen and (max-width: 1024px) {
    display: none;
  }
`;

export const ColTwo = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 3rem;
`;

export const ColThree = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3rem;
`;

export const ImageBox = styled.div`
  margin: 0 auto;
  width: 90%;
  height: auto;
`;

export const ArticleBox = styled.article`
  .title {
    display: block;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--main-red-100) !important;
    border-bottom: 1px solid var(--main-red-150);
    &:hover {
      color: var(--main-red-150) !important;
    }
  }
  .submenu-links {
    margin-left: 2rem;
  }
  .submenu-links li {
    margin-right: 0 !important;
  }
  .submenu-links li a {
    color: var(--main-red-150);
    display: block;
    border-bottom: 1px solid var(--main-red-150);
    &:hover {
      color: var(--main-red-100);
    }
  }
`;
