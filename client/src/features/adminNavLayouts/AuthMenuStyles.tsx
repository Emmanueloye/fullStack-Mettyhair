import styled from 'styled-components';

const AuthDropdown = styled.div<{ $isOpen?: boolean; $height?: number }>`
  position: relative;
  .menu-btn {
    display: flex;
    align-items: center;
    color: var(--admin-text-color);
    cursor: pointer;
    .icon {
      font-size: 1.6rem;
    }
    h5 {
      text-transform: capitalize;
    }
  }

  .menu {
    position: absolute;
    top: 3rem;
    right: 0rem;
    background-color: var(--admin-primary-color);
    padding: 1rem 2rem;
    font-size: 1.4rem;
    width: 20rem;
    height: ${(props) => `${props.$height}px`};
    overflow: hidden;
    z-index: 4;
    transition: var(--transition);
    li {
      margin-bottom: 2rem;
      &:first-child {
        margin-top: 2rem;
      }
    }
    a,
    button {
      display: flex;
      align-items: center;
      color: var(--admin-text-color);
      padding: 0.5rem;
      span {
        margin-left: 1rem;
      }
      &:hover {
        background-color: var(--main-red-300);
      }
    }
    button {
      background-color: transparent;
      border: none;
      width: 100%;
    }
  }
`;
export default AuthDropdown;
