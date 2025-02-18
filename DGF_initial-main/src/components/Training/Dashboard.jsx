import { Grid, Container } from "@mui/material";
import GraphComponent from "./GraphComponent";
 
const Dashboard = () => {
  // Data for the charts
  const requestInProgress = {
    labels: ["SPOC Approval Awaiting", "Preparing Plan", "Learning In Progress", "Clarification Awaited"],
    values: [5, 3, 5, 2],
    colors: ["#003896", "#088EE7", "#2BB381", "#E25252"],
    hoverColors: ["#66BB6A", "#FFD54F", "#29B6F6", "#66BB6A"]
  };
 
  const completedRequests = {
    labels: ["Completed", "Completed with Delay", "Partially Completed"],
    values: [5, 3, 5],
    colors: [ "#003896", "#2BB381", "#E25252"],
    hoverColors: ["#66BB6A", "#FF7043", "#FFA726"]
  };
 
  const incompleteRequests = {
    labels: ["Incomplete"],
    values: [5],
    colors: [ "#E25252"],
    hoverColors: [ "#E57373"]
  };
 
  const requestsOnHold = {
    labels: ["Request Kept on Hold", "Learnings Kept on Hold"],
    values: [3,2],
    colors: [  "#003896","#E25252"],
    hoverColors: [  "#FFA726","#A569BD"]
  };
  const styles = {
    container: {
      padding: "10px",
    },
    grid:{
padding: 0,
margin: 0,
justifyContent: 'space-between',
    }
    ,
    gridcotnainer:{
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
          title="Requests in Progress"
          data={requestInProgress}
          details={[
            "SPOC Approval<br />Awaiting: 5",
            "Preparing <br /> Learning Plan: 3",
            "Learning<br /> In Progress: 5",
            "Clarification <br />Awaited: 2"
          ]}
        />
      </Grid>
      <Grid item xs={12} md={6} style={styles.gridcotnainer}>
        <GraphComponent 
          title="Completed Requests"
          data={completedRequests}
          details={[
            "Completed: 5",
            "Completed <br />with Delay: 3",
            "Partially <br />Completed: 5"
          ]}
        />
      </Grid>
 
      {/* Second Row: Incomplete Requests and Requests on Hold */}
      <Grid item xs={12} md={6} style={styles.gridcotnainer}>
        <GraphComponent
          title="Incomplete Requests"
          data={incompleteRequests}
          details={[
            "Incomplete: 5"
          ]}
        />
      </Grid>
      <Grid item xs={12} md={6} style={styles.gridcotnainer}>
        <GraphComponent
          title="Requests on Hold"
          data={requestsOnHold}
          details={[
            "Request Kept on <br />Hold: 3",
            "Learnings Kept on<br /> Hold: 2"
          ]}
        />
      </Grid>
    </Grid>
  </Container>
  );
};
 
export default Dashboard;