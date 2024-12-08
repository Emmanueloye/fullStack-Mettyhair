import styled from 'styled-components';

const MainNavWrapper = styled.div`
  position: sticky;
  left: 0;
  top: 0;
  z-index: 10;
  .mobile-view {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
  }
  .main-box {
    height: 0;
    overflow: hidden;
    transition: var(--transition);
  }
  .nav-links {
    display: flex;
    flex-direction: column;

    li {
      border-bottom: 1px solid var(--main-red-200);
      margin-bottom: 2rem;
      &:first-child {
        margin-top: 2rem;
      }
    }
    a {
      display: flex;
      color: var(--primary-text-white);
      font-size: 1.5rem;
      text-transform: capitalize;
      padding: 0.6rem 1rem;

      &:hover {
        color: var(--main-blue);
      }
    }
  }
  .hidden-sm {
    display: none;
  }

  @media screen and (min-width: 1024px) {
    display: flex;
    justify-content: space-between;
    .hidden {
      display: none;
    }
    .hidden-sm {
      display: flex;
    }
    .main-box {
      height: 3rem;
      overflow: visible;
    }
    .nav-links {
      flex-direction: row;
      li {
        border-bottom: none;
        margin-right: 2rem;
        margin-bottom: 0;
        &:first-child {
          margin-top: 0;
        }
      }
    }
  }
  .active {
    color: var(--main-blue) !important;
  }
  .submenu-link {
    position: relative;
  }
`;
export default MainNavWrapper;
