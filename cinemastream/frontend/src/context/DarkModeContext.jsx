import React, { createContext, useCallback, useContext, useMemo, useReducer } from 'react';

const DarkModeContext = createContext(undefined);

const INITIAL_STATE = { darkMode: false };

function darkModeReducer(state, action) {
  switch (action.type) {
    case 'LIGHT':
      return { darkMode: false };
    case 'DARK':
      return { darkMode: true };
    case 'TOGGLE':
      return { darkMode: !state.darkMode };
    default:
      return state;
  }
}

export function DarkModeProvider({ children }) {
  const [state, dispatch] = useReducer(darkModeReducer, INITIAL_STATE);

  const toggleDarkMode = useCallback(() => dispatch({ type: 'TOGGLE' }), []);

  const value = useMemo(
    () => ({ darkMode: state.darkMode, toggleDarkMode }),
    [state.darkMode, toggleDarkMode]
  );

  return <DarkModeContext.Provider value={value}>{children}</DarkModeContext.Provider>;
}

export function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
}
