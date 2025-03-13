import { useState, useEffect, useContext } from "react";
import SpocApproval from './Spoc/SpocApproval';
import AuthContext from './Auth/AuthContext'; // Import the AuthContext
import { useParams } from "react-router-dom"
const SpocContainer = () => {
  const styles = {
    newSpocContainer: {
      flex: 'auto',
      boxSizing: 'border-box',
      padding: '3px 42px 0 25px',
      maxWidth: '100%',
      marginBottom:"50px"
    }
  };
 
  const { user } = useContext(AuthContext);
  const [roleId, setRoleId] = useState(null);
  const { requestid } = useParams(); 

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
      {roleId !== null && <SpocApproval roleId={roleId} requestid={requestid}/>}
    </div>
  );
};
 
export default SpocContainer;