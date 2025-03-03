import { Grid, Container } from "@mui/material";
import { useEffect, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import AuthContext from "../Auth/AuthContext";
import GraphComponent from "./GraphComponent";
import "../Training/Dashboard.css";
 
const Dashboard = ({ roleId }) => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [statusCounts, setStatusCounts] = useState({
    approvalrequested: 0,
    preparinglearningplan: 0,
    learninginitiated: 0,
    needclarification: 0,
    completed: 0,
    completedwithdelay: 0,
    partiallycompleted: 0,
    incomplete: 0,
    rejected: 0,
    learningsuspended: 0,
  });
 
  useEffect(() => {
    if (user) {
      fetch('http://localhost:8000/api/training-requests')
        .then(response => response.json())
        .then(data => {
          console.log("Fetched Data:", data); // Log the entire response
          console.log("Data inside response:", data.data); // Log the expected data part
          if (roleId === 10 || roleId === 4) {
            setRequests(data || []); // Set requests directly if the role matches
          } else {
            const userRequests = (data || []).filter(request => request.requestonbehalfof === user.emp_id);
            setRequests(userRequests);
          }
        })
        .catch(error => console.error('Error fetching data:', error));
    }
  }, [user]);
 
  useEffect(() => {
    const counts = {
      approvalrequested: 0,
      preparinglearningplan: 0,
      learninginitiated: 0,
      needclarification: 0,
      completed: 0,
      completedwithdelay: 0,
      partiallycompleted: 0,
      incomplete: 0,
      rejected: 0,
      learningsuspended: 0,
    };
 
    requests.forEach(request => {
      const status = request.requeststatus.toLowerCase().trim();
      if (status === "approval requested") {
        counts.approvalrequested++;
      }  else if (status === "learning initiated") {
        counts.learninginitiated++;
      } else if (status === "clarification requested") {
        counts.needclarification++;
      } else if (status === "completed") {
        counts.completed++;
      } else if (status === "completed with delay") {
        counts.completedwithdelay++;
      } else if (status === "partially completed") {
        counts.partiallycompleted++;
      } else if (status === "incomplete") {
        counts.incomplete++;
      } else if (status === "rejected") {
        counts.rejected++;
      } else if (status === "learning suspended") {
        counts.learningsuspended++;
      }else if(status === "spoc approved" || status==="capdev approved"){
        counts.preparinglearningplan++;
      }
    });
 
    setStatusCounts(counts);
  }, [requests]);
 
  const requestInProgress = {
    labels: ["SPOC Approval Awaiting", "Preparing Plan", "Learning In Progress", "Clarification Awaited"],
    values: [statusCounts.approvalrequested, statusCounts.preparinglearningplan, statusCounts.learninginitiated, statusCounts.needclarification],
    colors: ["#003896", "#088EE7", "#2BB381", "#E25252"],
    hoverColors: ["#66BB6A", "#FFD54F", "#29B6F6", "#66BB6A"]
  };
 
  const completedRequests = {
    labels: ["Completed", "Completed with Delay", "Partially Completed"],
    values: [statusCounts.completed, statusCounts.completedwithdelay, statusCounts.partiallycompleted],
    colors: ["#003896", "#2BB381", "#E25252"],
    hoverColors: ["#66BB6A", "#FF7043", "#FFA726"]
  };
 
  const incompleteRequests = {
    labels: ["Incomplete"],
    values: [statusCounts.incomplete],
    colors: ["#E25252"],
    hoverColors: ["#E57373"]
  };
 
  const requestsOnHold = {
    labels: ["Rejected Requests", "Learnings Kept on Hold"],
    values: [statusCounts.rejected, statusCounts.learningsuspended],
    colors: ["#003896", "#E25252"],
    hoverColors: ["#FFA726", "#A569BD"]
  };
 
  const styles = {
    container: {
      padding: "10px",
      overflow: "hidden",
    },
    grid: {
      padding: 0,
      marginTop: '10px',
      marginLeft: '0px',
      marginRight: '0px',
      marginBottom: '35px',
      justifyContent: 'space-between',
      gap: '22px',
    },
    gridcotnainer: {
      padding: 0,
      flexBasis: '48.5%',
    },
  };
 
  return (
    <Container style={styles.container} className="dashboard-container">
      <Grid container spacing={3} className="dashboard-grid" style={styles.grid}>
        {/* First Row: Requests in Progress and Completed Requests */}
        <Grid item xs={12} md={6} style={styles.gridcotnainer}>
          <GraphComponent
            className="graph-component"
            title="Requests in Progress"
            data={requestInProgress}
            details={[
              `SPOC Approval<br />Awaiting: ${statusCounts.approvalrequested}`,
              `Preparing <br /> Learning Plan: ${statusCounts.preparinglearningplan}`,
              `Learning<br /> In Progress: ${statusCounts.learninginitiated}`,
              `<span className='clarification-awaiting'>Clarification <br />Awaited: ${statusCounts.needclarification}</span>`
            ]}
          />
        </Grid>
        <Grid item xs={12} md={6} style={styles.gridcotnainer}>
          <GraphComponent
            title="Completed Requests"
            data={completedRequests}
            details={[
              `Completed: ${statusCounts.completed}`,
              `Completed <br />with Delay: ${statusCounts.completedwithdelay}`,
              `Partially <br />Completed: ${statusCounts.partiallycompleted}`
            ]}
          />
        </Grid>
 
        {/* Second Row: Incomplete Requests and Requests on Hold */}
        <Grid item xs={12} md={6} style={styles.gridcotnainer}>
          <GraphComponent
            title="Incomplete Requests"
            data={incompleteRequests}
            details={[`Incomplete: ${statusCounts.incomplete}`]}
          />
        </Grid>
        <Grid item xs={12} md={6} style={styles.gridcotnainer}>
          <GraphComponent
            title="Requests on Hold"
            data={requestsOnHold}
            details={[
              `Rejected <br />Requests: ${statusCounts.rejected}`,
              `Suspended<br /> Learning: ${statusCounts.learningsuspended}`
            ]}
          />
        </Grid>
      </Grid>
    </Container>
  );
};
 
Dashboard.propTypes = {
  roleId: PropTypes.number.isRequired,
};
 
export default Dashboard;