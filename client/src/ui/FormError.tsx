import styled from 'styled-components';

const FormErrorWrapper = styled.div`
  background-color: var(--primary-color);
  padding: 1rem;
  margin-bottom: 2rem;
  ul li {
    color: var(--secondary-text-white);
    font-size: 1.4rem;
    list-style: inside;
    margin-bottom: 0.5rem;
  }
`;

const FormError = ({ info }: { info: string | { message: string } }) => {
  return (
    <FormErrorWrapper>
      <ul>
        {typeof info === 'string' &&
          info?.split(',').map((message: string, key: number) => {
            return <li key={key}>{message}</li>;
          })}
        {typeof info === 'object' && <li>{info.message}</li>}
      </ul>
    </FormErrorWrapper>
  );
};

export default FormError;
