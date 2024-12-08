import TabBtnsWrapper from './TabBtnsStyles';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { uiActions } from '../../store/uiSlice';
import { NavLink } from 'react-router-dom';
import { slugifyText } from '../../utilities/HelperFunc';

type TabBtnsProps = {
  btnLabels: string[];
  type?: string;
  prefix?: string;
};

const TabBtns = ({ btnLabels, type = 'default', prefix }: TabBtnsProps) => {
  const dispatch = useAppDispatch();
  const { tabIndex } = useAppSelector((state) => state.ui);

  return (
    <TabBtnsWrapper>
      {type === 'default' &&
        btnLabels?.map((btnLabel, index) => (
          <button
            key={index}
            onClick={() => dispatch(uiActions.setTabIndex(index))}
            className={`${tabIndex === index ? 'active' : ''}`}
          >
            {btnLabel}
          </button>
        ))}

      {type === 'link' &&
        btnLabels?.map((btnLabel, index) => {
          let newUrl: string = '';
          if (prefix) newUrl = `${prefix}/${slugifyText(btnLabel)}`;
          if (!prefix) newUrl = `${slugifyText(btnLabel)}`;
          return (
            <NavLink
              key={index}
              to={`/${newUrl}`}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {btnLabel}
            </NavLink>
          );
        })}
    </TabBtnsWrapper>
  );
};

export default TabBtns;
