import styled, { css } from 'styled-components';
import LinkBtn from './LinkBtn';
import Icon from './Icon';
import React from 'react';

const EmptyWrapper = styled.article<{ type?: string }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: var(--primary-white);
  box-shadow: var(--shadow-rd);
  padding: 3rem;
  margin: 2rem auto;
  width: inherit;
  /* height: 50vh; */

  p {
    font-size: 1.6rem;
    margin-top: 3rem;
    /* text-transform: capitalize; */
  }
  ${(props) =>
    props.type === 'dark' &&
    css`
      background-color: var(--admin-white);
      p {
        color: var(--admin-sec-text-color);
      }
    `}
`;

const Empty = ({
  icon,
  message,
  btnText,
  url = '/',
  iconSize = '4rem',
  showLink = true,
  type,
}: {
  icon?: React.ReactNode;
  message: string;
  btnText?: string;
  url?: string;
  iconSize?: string;
  showLink?: boolean;
  type?: string;
}) => {
  return (
    <EmptyWrapper type={type}>
      <Icon icon={icon} color='var(--primary-color)' iconSize={iconSize} />
      <p>{message} </p>
      {showLink && <LinkBtn btnText={btnText} url={url} />}
    </EmptyWrapper>
  );
};

export default Empty;
