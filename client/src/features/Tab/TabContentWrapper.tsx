import styled from 'styled-components';

export const TabContentWrapper = styled.div<{ $dark?: boolean }>`
  background-color: ${(props) =>
    props.$dark ? 'var(--admin-white)' : 'var(--white)'};
  border: 1px solid var(--main-red-50);
  padding: 2rem 1.5rem;
`;

export const ContentWrapper = styled.div`
  h4 {
    text-transform: capitalize;
    margin-bottom: 1.2rem;
  }
  h5 {
    margin-bottom: 1rem;
    span {
      text-transform: capitalize;
    }
  }
`;

export const Group = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;

  @media screen and (min-width: 760px) {
    flex-wrap: nowrap;
  }
`;

export const RatingWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 2rem;
  margin: 2rem 0;
  span {
    font-size: 1.5rem;
  }
`;

export const FormButton = styled.button`
  background-color: var(--primary-color);
  border: none;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  color: var(--primary-text-white);
  font-weight: 600;
  padding: 1.2rem 4rem;
  margin-top: 2rem;
`;

export const Center = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  align-items: center;
`;
