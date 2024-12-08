import React from 'react';
import StyledModal, { Overlay } from './ModalStyles';
import { createPortal } from 'react-dom';

const Modal = ({ children }: { children: React.ReactNode }) => {
  return createPortal(
    <Overlay>
      <StyledModal>
        <div>{children}</div>
      </StyledModal>
    </Overlay>,
    document.body
  );
};

export default Modal;
