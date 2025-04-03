import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import AuthContext from './AuthContext';
import { backendUrl } from '../../../config/config';

const ProtectedRoute = ({ element, requiredRoleId }) => {
  const { user, role_id, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRoleId && !requiredRoleId.includes(role_id)) {
    console.log(`Access denied. User role_id: ${role_id}, Required role_id: ${requiredRoleId}`);
    return <Navigate to="/unauthorized" />;
  }

  return element;
};

ProtectedRoute.propTypes = {
  element: PropTypes.element.isRequired,
  requiredRoleId: PropTypes.arrayOf(PropTypes.number),
};

export default ProtectedRoute;