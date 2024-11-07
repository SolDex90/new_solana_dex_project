// src/components/ProtectedRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useGlobalState } from '../contexts/GlobalStateContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useGlobalState();

  if (!user) {
    return <Navigate to="/signin" />;
  }

  return children;
};

export default ProtectedRoute;
