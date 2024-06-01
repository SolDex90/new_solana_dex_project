// src/contexts/GlobalStateContext.js

import React, { createContext, useReducer, useContext } from 'react';

// Initial state
const initialState = {
  user: null,
  theme: 'light',
};

// Create contexts
const GlobalStateContext = createContext(initialState);
const GlobalDispatchContext = createContext(() => {});

// Reducer
const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'LOGOUT_USER':
      return { ...state, user: null };
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
};

// Provider component
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GlobalStateContext.Provider value={state}>
      <GlobalDispatchContext.Provider value={dispatch}>
        {children}
      </GlobalDispatchContext.Provider>
    </GlobalStateContext.Provider>
  );
};

// Custom hooks for using state and dispatch
export const useGlobalState = () => useContext(GlobalStateContext);
export const useGlobalDispatch = () => useContext(GlobalDispatchContext);
