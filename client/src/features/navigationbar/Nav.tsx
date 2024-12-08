import React from 'react';
import styled from 'styled-components';
import Container from '../../ui/Container';

const NavWrapper = styled.nav`
  background-color: var(--primary-color);
  padding: 1.5rem 1rem;

  /* z-index: 100; */
`;

const Nav = ({ children }: { children: React.ReactNode }) => {
  return (
    <NavWrapper>
      <Container>{children}</Container>
    </NavWrapper>
  );
};

export default Nav;
