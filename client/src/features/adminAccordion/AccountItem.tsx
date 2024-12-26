import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { AccordionLink, AccordionSubLink } from './AccordionStyles';
import { slugifyText } from '../../utilities/HelperFunc';
import { AccountLinks } from '../../data/accountLinks';

const AccordionItemBox = styled.article<{ $show?: boolean }>`
  display: ${(props) => (props.$show ? 'none' : 'block')};
`;

type AccordionProps = {
  menuItem: AccountLinks;
};

const AccountItem = ({ menuItem }: AccordionProps) => {
  return (
    <AccordionItemBox>
      <AccordionLink>
        <button className={`btn-acc-main btn-acc `}>
          <span>{menuItem.title}</span>
        </button>
      </AccordionLink>

      <AccordionSubLink $isOpen={true}>
        <ul>
          {menuItem.links.map((link, i) => (
            <li className='list' key={i}>
              <NavLink
                className={({ isActive }) =>
                  isActive ? 'active' : 'gen-active'
                }
                to={`/admin/account/${slugifyText(link)}`}
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

export default AccountItem;
