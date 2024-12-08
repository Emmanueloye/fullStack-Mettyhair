import styled from 'styled-components';
import { Overlay } from '../../ui/ModalStyles';
import spinner from '../../assets/images/spinner.gif';

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  img {
    width: 100px;
  }
`;

const UserLoader = () => {
  return (
    <Overlay>
      <LoaderWrapper>
        <img src={spinner} alt='page spinner' />
      </LoaderWrapper>
    </Overlay>
  );
};

export default UserLoader;
