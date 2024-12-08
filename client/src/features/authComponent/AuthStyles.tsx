import styled from 'styled-components';

const FormBox = styled.section`
  margin-top: 8rem;
  form {
    background-color: var(--primary-white);
    padding: 2rem 2rem 4rem;
  }

  .hidden {
    display: none;
  }

  @media screen and (min-width: 800px) {
    width: 80%;
    margin: 10rem auto;
  }

  @media screen and (min-width: 1024px) {
    width: 50%;
  }
`;

export const Header = styled.div<{
  $mb?: string;
  $mt?: string;
  $bg?: string;
  $color?: string;
}>`
  background-color: ${(props) =>
    props.$bg ? props.$bg : 'var(--primary-color)'};
  border-top-right-radius: 3rem;
  border-top-left-radius: 3rem;
  color: ${(props) => (props.$color ? props.$color : 'var(--main-red-100)')};
  text-align: center;
  padding: 2rem 1rem;
  margin-top: ${(props) => props.$mt};
  margin-bottom: ${(props) => props.$mb};
  text-transform: capitalize;
`;

export const PasswordIcon = styled.span`
  color: var(--main-red-200);
  font-size: 2rem;
  position: absolute;
  right: 5rem;
  top: 55%;
  transform: translateY(-50%);
`;

export const FormGroup = styled.div<{ $mb?: string; $height?: string }>`
  display: flex;
  margin-bottom: ${(props) => (props.$mb ? props.$mb : '1rem')};
  position: relative;

  .a-icon {
    background-color: var(--primary-color);
    font-size: 2rem;
    padding: 1rem 1.2rem;
    color: var(--main-red-100);
    height: ${(props) => props.$height};
  }
`;

export const AuthAction = styled.div`
  margin-top: 2rem;
  font-size: 1.3rem;
  margin-bottom: 2rem;

  span {
    margin-right: 0.4rem;
  }
  a {
    color: var(--primary-color);
    font-weight: 600;
    text-decoration: underline;
  }
`;

export default FormBox;
