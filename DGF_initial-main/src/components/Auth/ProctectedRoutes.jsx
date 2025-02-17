import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import AuthContext from './AuthContext';

const ProtectedRoute = ({ element }) => {
  const { user, loading } = useContext(AuthContext);
  console.log('Checking user state in ProtectedRoute:', user);

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner or any other loading indicator
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return element;
};

ProtectedRoute.propTypes = {
  element: PropTypes.element.isRequired,
};

export default ProtectedRoute;