import { useState, useEffect, useContext } from "react";
import RequesterInformation from './Training/Requesterinformation';
import AuthContext from './Auth/AuthContext'; // Import the AuthContext
import { useParams } from "react-router-dom"
const RequestInfoContainer = () => {
  const styles = {
    newSpocContainer: {
      minHeight: '100vh',
      padding: '10px 15px',
      boxSizing: 'border-box',
      maxHeight: '100vh',
      maxWidth: '100%',
      position: 'relative',
      marginLeft: '-16px'
    }
  };
 
  const { user } = useContext(AuthContext);
  const [roleId, setRoleId] = useState(null);
  const { requestId } = useParams();
 
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
      {/* {console.log(requestId,"container")}; */}
      {roleId !== null && <RequesterInformation roleId={roleId} requestId={requestId}/>}
     
      
    </div>
  );
};
 
export default RequestInfoContainer;