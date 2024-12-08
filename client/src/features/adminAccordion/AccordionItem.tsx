import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { AccordionLink, AccordionSubLink } from './AccordionStyles';
import { LinksType } from '../../data/sidebarLinks';
import { slugifyText } from '../../utilities/HelperFunc';
import { useRef } from 'react';
import { useAppDispatch } from '../../store/hook';
import { adminUIActions } from '../../store/adminUI';

const AccordionItemBox = styled.article<{ $show?: boolean }>`
  display: ${(props) => (props.$show ? 'none' : 'block')};
`;

type AccordionProps = {
  menuItem: LinksType;
  num: number;
  current: number;
  onBtnClick: (el: number) => void;
  show?: boolean;
};

const AccordionItem = ({
  menuItem,
  num,
  current,
  onBtnClick,
  show,
}: AccordionProps) => {
  const containerRef = useRef(null);
  const innerRef = useRef(null);
  const isOpen = num === current;
  const dispatch = useAppDispatch();

  return (
    <AccordionItemBox $show={show}>
      <AccordionLink onClick={() => onBtnClick(num)}>
        <button className={`btn btn-plus ${isOpen && 'active'}`}>
          <span>{menuItem.icon}</span>
          <span>{menuItem.title}</span>
          {isOpen ? <span>-</span> : <span>+</span>}
        </button>
      </AccordionLink>

      <AccordionSubLink $isOpen={isOpen} ref={containerRef}>
        <ul ref={innerRef}>
          {menuItem.links.map((link, i) => (
            <li key={i}>
              <NavLink
                className={({ isActive }) => (isActive ? 'active' : '')}
                to={`/admin/${slugifyText(link)}`}
                onClick={() => dispatch(adminUIActions.closeAdminSidebar())}
              >
                {link}
              </NavLink>
            </li>
          ))}
        </ul>
      </AccordionSubLink>
    </AccordionItemBox>
  );
};

export default AccordionItem;
