import styled from 'styled-components';

const StyledModal = styled.article`
  position: fixed;
  top: 20rem;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--main-light-blue);
  padding: 2rem;
  width: 80%;

  @media screen and (max-width: 620px) {
    width: 97%;
  }
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(204, 143, 163, 0.2);
  backdrop-filter: blur(1px);
  width: 100%;
  height: 100vh;
  z-index: 5000;
  /* display: none; */
`;

export default StyledModal;
