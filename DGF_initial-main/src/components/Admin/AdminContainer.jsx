import { useContext, useEffect, useState } from 'react';
// import Dashboard from "./Training/Dashboard";
// import RequestTable from "./Training/RequestTable";
// import TrainingHeaderBtn from "../Training/TrainingHeaderBtn";
import AdminSetting from './AdminSetting';
import AuthContext from '../Auth/AuthContext';
import AdminHeaderBtn from './AdminHeaderBtn';
 
const AdminContainer = () => {
  const { user } = useContext(AuthContext);
  const [roleId, setRoleId] = useState(null);
 
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
      padding: '2px 14px 0 28px',
      
      marginright: '0',
      maxHeight: '100vh',
      maxWidth: '100%',

    }
  };
 
  return (
    <div style={styles.mainContent}>
      <AdminHeaderBtn />
      {roleId && <AdminSetting roleId={roleId} />}
      {/* <Dashboard /> */}
    </div>
  );
};
 
export default AdminContainer;
