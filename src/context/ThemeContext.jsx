// AllRecipes/src/context/ThemeContext.jsx

import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('recipe-app-theme');
    return savedTheme || 'light';
  });

  const [isTransitioning, setIsTransitioning] = useState(false);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setIsTransitioning(true);
    
    setTimeout(() => {
      setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
      setIsTransitioning(false);
    }, 150);
  };

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('recipe-app-theme', theme);
    
    // Apply theme to document root for global CSS variables
    document.documentElement.setAttribute('data-theme', theme);
    
    // Also add a class to body for additional styling if needed
    document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
  }, [theme]);

  // Apply theme on component mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
  }, []);

  const value = {
    theme,
    setTheme,
    toggleTheme,
    isTransitioning,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

