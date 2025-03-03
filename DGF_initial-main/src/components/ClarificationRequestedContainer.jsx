import  { useState, useEffect, useContext } from 'react';
import ClarificationRequested from "./Training/ClarificationRequested";
import AuthContext from './Auth/AuthContext'; // Import the AuthContext
import { useParams } from "react-router-dom"
 
const ClarificationRequestedContainer = () => {
    const styles = {
        clarificationRequestedContainer: {
     
             // display: 'flex',
    // justifyContent: 'center',
    // alignItems: 'flex-start',
    // minHeight: '100vh',
    padding: '10px 30px',
    position: 'relative',
    boxSizing: 'border-box',
    // overflowY: 'auto',
    // width: 'calc(100% - 240px)', /* Adjust width to account for sidebar */
    // marginLeft: '240px',
    marginRight: '40px',
    maxHeight: '100vh',
    maxWidth: '100%'
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
    <div className="clarification-awaited-container" style={styles.clarificationRequestedContainer}>
        {roleId !== null && <ClarificationRequested roleId={roleId} requestid={requestid}/>}
  </div>
  )
}
 
export default ClarificationRequestedContainer