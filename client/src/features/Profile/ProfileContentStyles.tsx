import styled from 'styled-components';

export const ImageBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  border-bottom: 2px solid var(--primary-color);
  border-left: 2px solid var(--primary-color);
  border-right: 2px solid var(--primary-color);
  border-radius: var(--rounded);
  margin-bottom: 1rem;
  img {
    border-radius: var(--rounded);
  }
  .edit-link {
    margin-top: -2rem;
    margin-bottom: 2rem;
  }
`;

export const InfoWrapper = styled.div<{ $dark?: boolean }>`
  display: block;

  p,
  h5 {
    text-align: center;
  }
  p {
    font-weight: 600;
    text-transform: capitalize;
    margin-bottom: 0.7rem;
    color: ${(props) =>
      props.$dark ? 'var(--admin-sec-text-color)' : 'var(--primary-color)'};
    /* word-wrap: break-word; */
    overflow-wrap: break-word;
  }
  a {
    display: block;
    text-align: center;
    margin-bottom: 1rem;
    font-weight: 600;
    font-size: 1.5rem;
    text-decoration: underline;
  }
  h5 {
    text-transform: capitalize;
    margin-bottom: 1rem;
    color: ${(props) =>
      props.$dark ? 'var(--main-red-300)' : 'var(--main-black-500)'};
  }
  .details {
    border-bottom: 2px solid var(--primary-color);
    border-radius: var(--rounded);
    margin-bottom: 1rem;
  }
  .email {
    word-wrap: break-word;
    text-transform: lowercase;
  }
`;
