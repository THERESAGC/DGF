import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { backendUrl } from '../../../config/config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role_id, setRoleId] = useState(null); // Add role_id state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser); // Parse the user object
        console.log('User data retrieved from localStorage:', parsedUser);

        setUser(parsedUser); // Set the user object in state
        setRoleId(parsedUser.role_id); // Extract and set the role_id from the user object
        console.log('Role ID retrieved from user object:', parsedUser.role_id);
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData)); // Store the entire user object
    setUser(userData);
    setRoleId(userData.role_id); // Extract and set the role_id from the user object
  };

  const logout = () => {
    localStorage.removeItem('user'); // Remove the user object from localStorage
    setUser(null);
    setRoleId(null); // Clear role_id state
  };

  return (
    <AuthContext.Provider value={{ user, role_id, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;