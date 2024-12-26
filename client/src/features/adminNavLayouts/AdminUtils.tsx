import styled, { css } from 'styled-components';
import Input, { Label } from '../../ui/Input';

const Main = styled.main<{ $isOpen?: boolean }>`
  margin-left: 0;
  width: 100%;
  min-height: 100vh;
  transition: var(--transition);

  @media screen and (min-width: 1024px) {
    margin-left: ${(props) => (props.$isOpen ? '0' : '25rem')};
    width: ${(props) => (props.$isOpen ? '100%' : 'calc(100% - 25rem)')};
    /* min-height: 100vh; */
  }
`;

export const AdminSection = styled.section`
  background-color: var(--admin-alt-color);
  padding: 2rem;
  min-height: 100vh;

  .unread {
    font-weight: 600;
  }
  /* @media screen and (min-width: 1024px) {
    padding: 2rem 5rem;
  } */
`;

export const AdminGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  @media screen and (min-width: 460px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: 1fr;
  }
  @media screen and (min-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const TwoGrid = styled.div<{ type?: string }>`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  gap: 2rem;

  @media screen and (min-width: 660px) {
    ${(props) =>
      props.type === 'normal' &&
      css`
        grid-template-columns: repeat(2, 1fr);
      `}
  }

  @media screen and (min-width: 1070px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const ThreeGrid = styled.div<{ type?: string }>`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  gap: 2rem;
  justify-self: self-start;
  width: 100%;
  @media screen and (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);

    ${(props) =>
      props.type === 'image' &&
      css`
        grid-template-columns: 1fr 2fr;
        align-items: center;
      `}

    ${(props) =>
      props.type === 'full' &&
      css`
        grid-template-columns: 1fr;
        align-items: center;
      `}

    ${(props) =>
      props.type === 'two' &&
      css`
        grid-template-columns: repeat(2, 1fr);
        align-items: center;
      `}
  }
`;

export const AdminBox = styled.div`
  margin-top: 2rem;
  h4 {
    color: var(--admin-sec-text-color);
    margin-bottom: 1rem;
    text-transform: capitalize;
  }
`;

export const AdminHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  border-bottom: 2px solid var(--main-red-300);
  margin: 1rem 0 3rem;
  padding: 1.5rem;
  border-radius: 3rem;
  text-transform: capitalize;
  h4 {
    color: var(--admin-sec-text-color);
  }
  a {
    background-color: var(--main-red-600);
    color: var(--white);
    font-size: 1.3rem;
    padding: 1rem 2rem;
    border-radius: var(--border-radius-lg);
  }
`;

export const AFormGroup = styled.div`
  margin-top: 1rem;
  margin-bottom: 2rem;
`;

export const AFormGroupExt = styled(AFormGroup)`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const Status = styled.span<{ $isActive?: boolean }>`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) =>
    props.$isActive ? '#059669' : 'var(--main-red-500)'};
  border-radius: var(--border-radius-md);
  color: var(--white);
  padding: 0.3rem 1.3rem;
`;

export const InputExt = styled(Input)`
  width: 2rem;
  height: 2rem;
  accent-color: var(--main-red-600);
`;
export const InputSm = styled(Input)`
  width: 1.3rem;
  height: 1.3rem;
  accent-color: var(--main-red-600);
`;

export const LabelExt = styled(Label)`
  margin-bottom: 0;
`;
export const LabelSm = styled(Label)`
  font-size: 1.4rem;
  margin-bottom: 0;
`;
export const ABox = styled.div`
  margin-left: 3rem;
  input {
    font-size: 1.3rem;
  }
`;

export default Main;
