// AllRecipes/src/components/layout/ThemeToggle.jsx
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme, isTransitioning, isDark } = useTheme();

  return (
    <button 
      className={`theme-toggle ${isTransitioning ? 'transitioning' : ''}`}
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className="toggle-container">
        <div className={`toggle-switch ${theme}`}>
          <div className="toggle-handle">
            {isDark ? (

              // Moon icon for dark mode
              <svg className="theme-icon moon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/>
              </svg>
            ) : (

              // Sun icon for light mode
              <svg className="theme-icon sun" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,18a6,6,0,1,1,6-6A6,6,0,0,1,12,18ZM12,8a4,4,0,1,0,4,4A4,4,0,0,0,12,8Zm0-4a1,1,0,0,1,1,1V3a1,1,0,0,1-2,0V5A1,1,0,0,1,12,4ZM21,13H19a1,1,0,0,1,0-2h2a1,1,0,0,1,0,2Zm-3.64-7.36a1,1,0,0,1-.71-.29,1,1,0,0,1,0-1.42l1.42-1.41a1,1,0,0,1,1.41,1.41L18.07,5.34A1,1,0,0,1,17.36,5.64ZM12,20a1,1,0,0,1,1,1v2a1,1,0,0,1-2,0V21A1,1,0,0,1,12,20ZM5.64,17.36a1,1,0,0,1-.71.29,1,1,0,0,1-.71-.29L2.81,15.95a1,1,0,0,1,1.41-1.41l1.42,1.41A1,1,0,0,1,5.64,17.36ZM5,13H3a1,1,0,0,1,0-2H5a1,1,0,0,1,0,2ZM6.36,5.64A1,1,0,0,1,5.64,5.34L4.22,3.93A1,1,0,0,1,5.64,2.52L7.05,3.93a1,1,0,0,1,0,1.42A1,1,0,0,1,6.36,5.64Z"/>
              </svg>
            )}

          </div>
        </div>
        <span className="toggle-label">
          {isDark ? 'Dark' : 'Light'}
        </span>
      </div>
    </button>
  );
};

export default ThemeToggle;