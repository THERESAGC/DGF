import {  useState ,useEffect,useContext} from "react";
import PropTypes from 'prop-types';
import { useNavigate ,useParams } from "react-router-dom";
import { Paper, Typography, Grid, Divider, Box, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Radio, RadioGroup, FormControlLabel, TextField, Button, Avatar } from "@mui/material";
import "./SpocApproval.css";
import AuthContext from "../Auth/AuthContext";
import formatDate from "../../utils/dateUtils";
import removeHtmlTags from "../../utils/htmlUtils";

const SpocApproval = ({roleId}) => {
  const [action, setAction] = useState("approve");
  const [comments, setComments] = useState("");
  const navigate = useNavigate();
  const [learners, setLearners] = useState([]); // State to hold the fetched learners
  const { requestid } = useParams(); 
  const { user } = useContext(AuthContext); // Get the user from AuthContext
  const [requestDetails, setRequestDetails] = useState(null); // Store request details

  
  useEffect(() => {
    // Fetch  learner data from the API when the component is mounted
    fetch(`http://localhost:8000/api/getEmpNewTrainingRequested/getEmpNewTrainingRequested/${requestid}`)
      .then(response => response.json())
      .then(learnerdata => {
        setLearners(learnerdata); // Store fetched data into the learners state
        console.log("Learners Data:", learnerdata); // Log the fetched data
      })
      .catch(error => {
        console.error("Error fetching data:", error); // Log any errors during the fetch
      });
  }, []); // Empty dependency array ensures this effect runs only once when the component mounts

  useEffect(() => {
    console.log("Request ID in Spoc Approval Loading Time",requestid)
    if (requestid) {
      fetch(`http://localhost:8000/api/training-request/${requestid}`)
        .then(response => response.json())
        .then(data => {
          setRequestDetails(data);console.log('Request Details:', data);
        })
        .catch(error => console.error('Error fetching data:', error));
    }
  }, [requestid]);
  useEffect(() => {
    console.log('Requests State Updated:', requestDetails); // This will log after state change
  }, [requestDetails]); // This hook will trigger every time the requests state is updated
  



  const handleSubmit = async () => {
   
    const requestData = {
      requestId:  requestDetails?.requestid,  
      status: action,  
      roleId: roleId,  
      approverId: user.emp_id
    };

    try {
      const response = await fetch("http://localhost:8000/api/request-status/update-status", {
        method: "POST", // Set the request method to POST
        headers: {
          "Content-Type": "application/json", // Specify that the body content is JSON
        },
        body: JSON.stringify(requestData), // Convert the request body to JSON
         // Log the request data
      });
      console.log("Request Data:", requestData);
      const data = await response.json(); // Parse the JSON response
      if (response.ok) {
        console.log("API call successful:", data); // Handle the success response
        alert("Status updated successfully!");
      } else {
        console.error("Error in API call:", data); // Handle errors
        alert("Error updating status.");
      }
    } catch (error) {
      console.error("Error:", error); // Handle any other errors
      alert("An error occurred while updating status.");
    }
  };


  return (
    <>
      <Box justifyContent="space-between">
        <Typography fullWidth variant="h5" gutterBottom className="mainHeading" style={{ fontWeight: "bold", fontSize: "14px" }}>
          Approve Learning Request
        </Typography>
        <Divider style={{ margin: "1rem 0 ", marginLeft: '-30px', marginRight: '-20px' }} />
      </Box>
 
      <Paper elevation={1} className="paper" style={{ height: "100%", width: "85%" }}>
        <div className="inner-container">
          <Box style={{ padding: "10px", marginTop: "1rem" }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className="form-control" style={{ marginBottom: "1rem" }}>
                  <Typography className="typography-label-upper">
                    Request ID/No:
                  </Typography>
                  <Typography className="typography-value-upper">
                  #{requestDetails?.requestid}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className="form-control">
                  <Typography className="typography-label-upper">
                    Request By:
                  </Typography>
                  <Typography className="typography-value-upper">
                  {requestDetails?.requestedby}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className="form-control">
                  <Typography className="typography-label-upper">
                    Project:
                  </Typography>
                  <Typography className="typography-value-upper">
                   {requestDetails?.newprospectname || requestDetails?.project}             
                  </Typography>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className="form-control">
                  <Typography className="typography-label-upper">
                    Service Division:
                  </Typography>
                  <Typography className="typography-value-upper">
                  {requestDetails?.service_division}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className="form-control">
                  <Typography className="typography-label-upper">
                    Expected Completion:
                  </Typography>
                  <Typography className="typography-value-upper">
                    {formatDate(requestDetails?.expecteddeadline)  }                  
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className="form-control">
                  <Typography className="typography-label-upper">
                    Techstack / Compentancy:
                  </Typography>
                  <Typography className="typography-value-upper">
                    {requestDetails?.techstack}
                  </Typography>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2} style={{ marginTop: "1rem" }}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className="form-control">
                  <Typography className="typography-label-upper">
                    Primary Skills :
                  </Typography>
                  <Typography className="typography-value-upper">
                  {/* {requestDetails?.primarySkills?.join(', ')} */}
                  {requestDetails?.primarySkills && requestDetails?.primarySkills.length > 0 ? (
        <ul style={{ paddingLeft: '20px' }}>
          {requestDetails?.primarySkills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      ) : (
        <Typography className="typography-value-upper">No skills available</Typography>
      )}
                  </Typography>

                </FormControl>
              </Grid>
            </Grid>
          </Box>
          <Divider className="divider" style={{ marginTop: "1rem", marginBottom: "1rem" }} />
          <Box>
            <Grid container spacing={2} style={{ marginTop: "0.5rem" }}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className="form-control">
                  <Typography className="typography-label-upper">
                    Other Skill Information in Details:
                  </Typography>
                  <Typography className="typography-value-upper">
                   { removeHtmlTags(requestDetails?.otherskill)}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className="form-control" style={{ marginBottom: "1rem", display: "flex", alignItems: "center" }}>
                  <Typography className="typography-label-upper">
                    Completion Criteria:
                  </Typography>
                  <Typography  className="typography-value-upper"
  style={{ fontSize: "12px", display: "flex", alignItems: "center" }}>
    {removeHtmlTags(requestDetails?.suggestedcompletioncriteria)}
    </Typography>

                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2} style={{ padding: "10px", marginTop: "1rem" }}>
              <Grid item xs={12}>
                <FormControl fullWidth className="form-control">
                  <Typography className="typography-label-upper">
                    Comments:
                  </Typography>
                  <Typography  className="typography-value-upper"  style={{ fontSize: "12px", display: "flex", alignItems: "center" }}>
                    {removeHtmlTags(requestDetails?.comments)}
                  </Typography>
 

                </FormControl>
              </Grid>
            </Grid>
          </Box>
          <Divider className="divider" style={{ marginTop: "1rem", marginBottom: "1rem" }} />
          <Box>
            <div style={{ maxWidth: "100%", margin: "auto", padding: 20 }}>
              <h2 style={{ fontSize: "12px", marginBottom: "1rem" }}>{learners.length} Learners are allocated to this learning request</h2>
              <TableContainer
                component={Paper}
                style={{ padding: "16px", marginTop: "16px", maxWidth: "97%" }} elevation={0}
              >
                <Table size="small">
                  {learners.length > 0 && (
                    <TableHead sx={{ backgroundColor: "#CCE3FF" }}>
                      <TableRow>
                        <TableCell
                          style={{ padding: "8px", fontWeight: "bold", fontSize: "12px" }}
                        >
                          Employee ID
                        </TableCell>
                        <TableCell
                          style={{ padding: "8px", fontWeight: "bold", fontSize: "12px" }}
                        >
                          Name
                        </TableCell>
                        <TableCell
                          style={{ padding: "8px", fontWeight: "bold", fontSize: "12px" }}
                        >
                          Available From
                        </TableCell>
                        <TableCell
                          style={{ padding: "8px", fontWeight: "bold", fontSize: "12px" }}
                        >
                          Daily Bandwidth
                        </TableCell>
                        <TableCell
                          style={{ padding: "8px", fontWeight: "bold", fontSize: "12px" }}
                        >
                          Available on Weekend?
                        </TableCell>
                      </TableRow>
                    </TableHead>
                  )}
                 <TableBody>
      {learners.length > 0 ? (
        learners.map((learner) => (
          <TableRow key={learner.id}>
            <TableCell style={{ padding: "8px", fontSize: "12px" }}>
              {learner.emp_id}
            </TableCell>
            <TableCell style={{ padding: "8px", fontSize: "12px" }}>
              <Box display="flex" alignItems="center" gap={1}>
                <Avatar src={learner.image} />
                {learner.name}
              </Box>
            </TableCell>
            <TableCell style={{ padding: "8px", fontSize: "12px" }}>
              {formatDate(learner.availablefrom)}
            </TableCell>
            <TableCell style={{ padding: "8px", fontSize: "12px" }}>
              {learner.dailyband}
            </TableCell>
            <TableCell style={{ padding: "8px", fontSize: "12px" }}>
              {learner.availableonweekend ===1?"Yes":"No"}
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={5} style={{ textAlign: "center" }}>
            No learners found
          </TableCell>
        </TableRow>
      )}
    </TableBody>
                </Table>
              </TableContainer>
              <Box
                style={{
                  backgroundColor: "#F8FBFF",
                  padding: "16px",
                  borderRadius: "8px",
                  marginTop: "1rem",
                  marginBottom: "1rem"
                }}
              >
                <Typography style={{ fontSize: "12px", marginBottom: "1rem", color: "#4F4949" }}>
                  Take action on this training request
                </Typography>
                <FormControl component="fieldset" style={{ marginBottom: "1rem" }}>
                  <RadioGroup
                    row
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                  >
                    <FormControlLabel
                      value="approve"
                      control={<Radio />}
                      label={
                        <Typography style={{ fontSize: "12px", fontWeight: "bold" }}>
                          Approve
                        </Typography>
                      }
                    />
                    <FormControlLabel
                      value="reject"
                      control={<Radio />}
                      label={
                        <Typography style={{ fontSize: "12px", fontWeight: "bold" }}>
                          Reject
                        </Typography>
                      }
                    />
                     {roleId === 4 && (
                      <FormControlLabel value="hold" control={<Radio />} label={<Typography style={{ fontSize: "12px", fontWeight: "bold" }}>Suspend Learning</Typography>} />
                    )}
                    <FormControlLabel
                      value="needClarification"
                      control={<Radio />}
                      label={
                        <Typography style={{ fontSize: "12px", fontWeight: "bold" }}>
                          Need Clarification
                        </Typography>
                      }
                    />
                  </RadioGroup>
                </FormControl>
                <FormControl fullWidth style={{ marginBottom: "1rem" }}>
                  <Typography
                    style={{ fontSize: "12px", marginTop: "0.5rem", color: "#4F4949" }}
                  >
                    Comments
                  </Typography>
                  <TextField
                    multiline
                    rows={4} // Ensure this is set to 4 rows
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    InputProps={{
                      style: { fontSize: '12px', backgroundColor: '#ffffff', padding: '10px', minHeight: '100px' }, // Set minimum height
                    }}
                  />
                </FormControl>
              </Box>
              <Box
                display="flex"
                justifyContent="flex-end"
                style={{ marginTop: "4rem" }}
                gap={2}
              >
                <Button
                  variant="outlined"
                  style={{ minWidth: "12px", textTransform: 'none', color: '#1C71FE', boxShadow: 'none', border: 'none', }}
                  onClick={() => navigate("/training-container")} // Add this line
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  style={{ minWidth: "120px", textTransform: 'none', borderRadius: '10px ', backgroundColor: '#066DD2', boxShadow: 'none', color: 'white' }}
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </Box>
            </div>
          </Box>
        </div>
      </Paper>
    </>
  );
};
 
SpocApproval.propTypes = {
  roleId: PropTypes.number.isRequired,
};
 
export default SpocApproval;