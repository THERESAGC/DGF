import { useState, useEffect, useContext } from 'react';
import AuthContext from './Auth/AuthContext'; // Adjust the path as necessary
import Dashboard from "./Training/Dashboard";
 
const DashboardContainer = () => {
  const [roleId, setRoleId] = useState(null);
  const { user } = useContext(AuthContext);
  useEffect(() => {
    if (user) {
      setRoleId(user.role_id);
    } else {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setRoleId(parsedUser.role_id);
      }
    }
  }, [user]);
  const styles = {
    mainContent: {
      flex: 'auto',
      boxSizing: 'border-box',
      padding: '10px 10px 0 0',
      marginright: '0',
      maxHeight: '100vh',
      maxWidth: '100%',
    }
  };
 
  return (
    <div style={styles.mainContent}>
      {/* <TrainingHeaderBtn /> */}
      {roleId &&   <Dashboard roleId={roleId} />}
    </div>
  );
};
 
 
export default DashboardContainer;