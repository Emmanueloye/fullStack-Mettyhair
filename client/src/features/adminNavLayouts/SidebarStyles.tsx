import styled from 'styled-components';

const AdminSidebar = styled.aside<{ $isOpen?: boolean }>`
  color: var(--admin-text-color);
  background-color: var(--admin-primary-color);
  position: fixed;
  top: 0;
  left: ${(props) => (props.$isOpen ? '0' : '-200%')};
  height: 100%;
  width: 95%;
  z-index: 10;
  overflow-y: auto;
  transition: var(--transition);

  /* width */
  &::-webkit-scrollbar {
    width: 10px;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    background: var(--white);
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: var(--main-red-600);
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: var(--main-red-400);
  }
  .user-box {
    background-color: var(--admin-sec-bg);
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.6rem 1rem;
    position: relative;
    img {
      border-radius: var(--rounded);
    }
  }
  .icon-box {
    font-size: 2rem;
    position: absolute;
    right: 1rem;
    top: 1rem;
  }
  .box {
    text-transform: capitalize;
    p {
      font-size: 1.2rem;
      margin-top: 0.6rem;
    }
  }

  @media screen and (min-width: 650px) {
    width: 60%;
    .user-box {
      padding: 1rem;
    }
  }
  @media screen and (min-width: 1024px) {
    left: 0; //0
    width: ${(props) => (props.$isOpen ? '0' : '25rem')};
    .icon-box {
      display: none;
    }
  }
`;
export default AdminSidebar;
