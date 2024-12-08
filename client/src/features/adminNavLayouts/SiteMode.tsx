import { useEffect, useState } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import styled from 'styled-components';

export const ModeBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--admin-temp-color);
  border: none;
  border-radius: var(--rounded);
  color: var(--admin-text-color);
  font-size: 2rem;
  padding: 0.8rem 1rem;
  cursor: pointer;
`;

const SiteMode = () => {
  // Get default site mode from localstorage and convert to boolean
  const defaultMode =
    localStorage.getItem('isDarkMode') === 'true' ? true : false;

  // Set the state with the default mode
  const [isDarkMode, setIsDarkMode] = useState(defaultMode);

  //   Handle site mode on click
  const handleSiteMode = () => {
    const siteMode = !isDarkMode;
    setIsDarkMode(siteMode);
    localStorage.setItem('isDarkMode', `${siteMode}`);
  };

  //   To toggle dark and light mode class on the html element
  useEffect(() => {
    const storedSiteMode = localStorage.getItem('isDarkMode') === 'true';
    if (storedSiteMode) {
      document.documentElement.classList.add('dark-mode');
      document.documentElement.classList.remove('light-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
      document.documentElement.classList.add('light-mode');
    }
  }, [isDarkMode]);

  return (
    <div>
      {isDarkMode ? (
        <ModeBtn onClick={handleSiteMode}>
          <FaSun />
        </ModeBtn>
      ) : (
        <ModeBtn>
          <FaMoon onClick={handleSiteMode} />
        </ModeBtn>
      )}
    </div>
  );
};

export default SiteMode;
