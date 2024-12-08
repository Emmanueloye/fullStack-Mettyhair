import styled from 'styled-components';

const FormBox = styled.div`
  form {
    display: flex;
    width: 100%;
  }
  select {
    border: 1px solid var(--primary-text-white);
    border-top-left-radius: var(--border-radius-sm);
    border-bottom-left-radius: var(--border-radius-sm);
    width: 30%;
    padding: 1.4rem 2rem;
    outline: none;
  }

  .input-search {
    position: relative;
    width: 100%;
    input {
      border: 1px solid var(--primary-text-white);
      border-top-right-radius: var(--border-radius-sm);
      border-bottom-right-radius: var(--border-radius-sm);
      font-family: 'Lato', sans-serif;
      width: 100%;
      padding: 1.5rem 2rem;
      outline: none;
      margin-right: -2rem;
    }
    .btn {
      position: absolute;
      top: 1rem;
      right: 0;
      background-color: transparent;
      border: none;
    }
  }
  .btn-box {
    display: flex;
    justify-content: center;
    align-items: center;
    .close-btn {
      background-color: var(--primary-color);
      border: none;
      border-radius: var(--border-radius-lg);
      color: var(--primary-text-white);
      margin-top: 3rem;
      padding: 1rem 2rem;
      cursor: pointer;
      &:hover {
        background-color: var(--main-red-600);
      }
    }
  }

  @media screen and (max-width: 400px) {
    form {
      flex-direction: column;
      gap: 1rem;
    }
    select,
    input {
      width: 100%;
      border-radius: var(--border-radius-sm);
    }
  }
`;

export default FormBox;
