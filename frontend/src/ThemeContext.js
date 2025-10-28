import React, { createContext, useState, useMemo, useContext } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

// Create a context for the theme
export const ThemeContext = createContext({
  toggleTheme: () => {},
  mode: 'light',
});

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

// Create a provider component
export const CustomThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('themeMode');
    // Also possible to check system preference:
    // const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedMode || 'light';
  });

  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', newMode);
      return newMode;
    });
  };

  // Create the MUI theme object based on the current mode
  const theme = useMemo(
    () => createTheme({ palette: { mode } }),
    [mode]
  );

  const contextValue = useMemo(() => ({ mode, toggleTheme }), [mode]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline /> {/* Ensures a consistent baseline and applies background colors */}
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};