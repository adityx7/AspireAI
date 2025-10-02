import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../pages/AuthContext';

// ProtectedRoute component that checks for authentication
const ProtectedRoute = ({ children, requireAuth = true, userType = 'student' }) => {
  const { userUSN, mentorID } = useAuth();
  
  // Check if the user is authenticated based on userType
  const isAuthenticated = userType === 'student' 
    ? !!userUSN && !!localStorage.getItem('studentToken')
    : !!mentorID;

  if (requireAuth && !isAuthenticated) {
    // If authentication is required but user is not authenticated, redirect to login
    return <Navigate to={userType === 'student' ? '/login' : '/mentor-login'} />;
  }

  // If no authentication required or user is authenticated, render the children
  return children;
};

export default ProtectedRoute;