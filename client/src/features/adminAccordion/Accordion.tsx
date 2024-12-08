import { AiFillDashboard } from 'react-icons/ai';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import AccordionItem from './AccordionItem';
import { AccordionLink } from './AccordionStyles';
import { sidebarLinks } from '../../data/sidebarLinks';
import { useState } from 'react';
import { SPECIAL_ROUTES } from '../../utilities/constant';
import { User } from '../../dtos/userDto';

const AccordionWrapper = styled.div`
  margin-top: 2rem;
  padding: 1rem 2rem;
`;

const Accordion = ({ user }: { user: User }) => {
  const [currentPos, setCurrentPos] = useState<number>(0);

  return (
    <AccordionWrapper>
      <AccordionLink>
        <NavLink
          to='/admin'
          className={({ isActive }) => (isActive ? 'btn active' : 'btn-link')}
        >
          <span>
            <AiFillDashboard />
          </span>
          <span>Dashboard</span>
        </NavLink>
      </AccordionLink>

      {sidebarLinks.map((item, i) => {
        const show =
          SPECIAL_ROUTES.includes(item.title) &&
          !user?.role.startsWith('super');
        return (
          <AccordionItem
            key={item.id}
            num={i}
            menuItem={item}
            current={currentPos}
            onBtnClick={setCurrentPos}
            show={show}
          />
        );
      })}
    </AccordionWrapper>
  );
};

export default Accordion;
