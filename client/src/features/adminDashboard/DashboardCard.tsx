import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const DCard = styled.article<{ $col?: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--admin-white);
  box-shadow: var(--shadow-rd);
  color: var(--admin-sec-text-color);
  padding: 2rem;
  text-transform: capitalize;
  text-align: center;

  .icon {
    color: ${(props) => props.$col};
    font-size: 3rem;
    margin: 1.5rem 0;
  }
  a {
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--main-red-500);
    text-decoration: underline;
  }
`;

const DashboardCard = ({
  icon,
  title,
  url,
  linkLabel,
  iconColor,
}: {
  icon: React.ReactNode;
  title: string;
  url: string;
  linkLabel: string;
  iconColor?: string;
}) => {
  return (
    <DCard $col={iconColor}>
      <h5>{title}</h5>
      <span className='icon'>{icon}</span>
      <Link to={url}> {linkLabel}</Link>
    </DCard>
  );
};

export default DashboardCard;
