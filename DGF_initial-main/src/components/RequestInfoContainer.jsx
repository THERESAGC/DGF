import { useState, useEffect, useContext } from "react";
import RequesterInformation from './Training/Requesterinformation';
import AuthContext from './Auth/AuthContext'; // Import the AuthContext
import { useParams } from "react-router-dom"
const RequestInfoContainer = () => {
  const styles = {
    newRequestInfoContainer: {
     
      padding: '10px 42px 0px 25px',
      boxSizing: 'border-box',
      marginBottom: '50px',
      maxWidth: '100%',
      position: 'relative',
      
     
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
    <div className="request-info-container" style={styles.newRequestInfoContainer}>
      {/* Pass roleId to SpocApproval */}
      {/* {console.log(requestId,"container")}; */}
      {roleId !== null && <RequesterInformation roleId={roleId} requestId={requestId}/>}
     
      
    </div>
  );
};
 
export default RequestInfoContainer;