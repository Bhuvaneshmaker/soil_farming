import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    // User is not logged in, redirect to login page
    return <Navigate to="/login" />;
  }
  
  if (requiredRole === 'admin' && currentUser.role !== 'admin') {
    // User is not an admin, redirect to home page
    return <Navigate to="/" />;
  }
  
  return children;
};

export default ProtectedRoute;