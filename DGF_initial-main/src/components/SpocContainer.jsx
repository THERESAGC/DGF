import { useState, useEffect, useContext } from "react";
import SpocApproval from './Spoc/SpocApproval';
import AuthContext from './Auth/AuthContext'; // Import the AuthContext
 
const SpocContainer = () => {
  const styles = {
    newSpocContainer: {
      minHeight: '100vh',
      padding: '10px 30px',
      boxSizing: 'border-box',
      marginLeft: '240px',
      maxHeight: '100vh',
      maxWidth: '100%',
      position: 'relative',
    }
  };
 
  const { user } = useContext(AuthContext);
  const [roleId, setRoleId] = useState(null);
 
  useEffect(() => {
    if (user) {
      setRoleId(user.role_id); // Assuming role_id is part of the user object
    } else {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setRoleId(parsedUser.role_id); // Assuming role_id is in localStorage user object
      }
    }
  }, [user]);
 
  return (
    <div className="spoc-approval-container" style={styles.newSpocContainer}>
      {/* Pass roleId to SpocApproval */}
      {roleId !== null && <SpocApproval roleId={roleId} />}
    </div>
  );
};
 
export default SpocContainer;