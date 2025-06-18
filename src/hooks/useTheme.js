// AllRecipes/src/hooks/useTheme.js
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

// Additional hook for theme-specific styles
export const useThemeStyles = () => {
  const { theme, isDark, isLight } = useTheme();
  
  return {
    theme,
    isDark,
    isLight,
    
    // Helper functions for conditional styling
    getThemeClass: (lightClass, darkClass) => isDark ? darkClass : lightClass,
    getThemeStyle: (lightStyle, darkStyle) => isDark ? darkStyle : lightStyle,
  };
};