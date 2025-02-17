import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const PrivateRoute = ({ component: Component }) => {
  const { auth } = useContext(AuthContext);
  const location = useLocation();

  if (!auth?.token) {
    console.log('No auth token found, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Component />;
};

export default PrivateRoute;