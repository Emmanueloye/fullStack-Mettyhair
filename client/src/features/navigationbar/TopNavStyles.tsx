import styled from 'styled-components';

const TopnavWrapper = styled.div`
  background-color: var(--main-red-700);
  padding: 0.7rem 1rem;

  .socials {
    display: flex;
    align-items: center;
  }
  .user-auth {
    display: flex;
    align-items: center;
  }
  .img {
    border-radius: var(--rounded);
    object-fit: fill;
    margin-right: 1rem;
  }
  .link {
    color: var(--secondary-text-white);
    font-size: 1.4rem;
    text-transform: capitalize;
    margin-right: 0.6rem;
    text-decoration: underline;
    cursor: pointer;
  }
`;

export default TopnavWrapper;
