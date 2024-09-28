import React, { createContext, useContext, useEffect } from 'react'; // Removed useState

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const theme = 'dark'; // Hardcode the theme as 'dark'

  // Apply dark theme on mount
  useEffect(() => {
    console.log('Applying theme: dark');
    document.body.className = 'dark'; // Always apply dark theme
  }, []);

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
