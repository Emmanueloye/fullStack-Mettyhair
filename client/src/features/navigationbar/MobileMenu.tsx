import styled from 'styled-components';
import { Overlay } from '../../ui/ModalStyles';

const MobileMobileWrapper = styled.div`
  background-color: var(--main-red-700);
  position: sticky;
  top: 0;
  left: 0;
  height: 100vh;
  width: 70%;
  z-index: 1200;
`;

const MobileMenu = () => {
  return (
    <Overlay>
      <MobileMobileWrapper>
        <div className='mobile-header'>x</div>
      </MobileMobileWrapper>
    </Overlay>
  );
};

export default MobileMenu;
