import styled, { css } from 'styled-components';

const BtnLinkWrapper = styled.div<{
  type?: string;
  $mt?: string;
}>`
  box-shadow: var(--shadow-md);
  margin-top: ${(props) => (props.$mt ? props.$mt : '3rem')};
  border-radius: var(--border-radius-lg);
  position: relative;

  .btn-link {
    display: block;
    width: 100%;
    color: var(--primary-text-white);
    font-weight: 600;
    text-transform: uppercase;
    padding: 1.3rem 4rem;
  }

  ${(props) =>
    props.type === 'regular' &&
    css`
      display: inline-block;
      background-color: var(--primary-color);
      &:hover {
        background-color: var(--main-red-600);
      }
    `}

  ${(props) =>
    props.type === 'white' &&
    css`
      display: inline-block;
      background-color: var(--main-light-blue);
      margin-top: 6rem;
      .btn-link {
        color: var(--primary-text-black);
      }
      &:hover {
        background-color: transparent;
        border: 1px solid var(--primary-text-white);
        .btn-link {
          color: var(--main-light-blue);
        }
      }
    `}

  ${(props) =>
    props.type === 'cart' &&
    css`
      display: block;
      background-color: var(--primary-color);
      text-align: center;
      .cart-icon {
        background-color: var(--main-red-700);
        border-radius: var(--rounded);
        position: absolute;
        top: 0;
        right: 0;
        padding: 1rem;
        width: 4rem;
        height: 4rem;
      }
      &:hover {
        background-color: var(--main-red-600);
      }
    `}
`;

BtnLinkWrapper.defaultProps = {
  type: 'regular',
};
export default BtnLinkWrapper;
