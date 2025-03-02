import {  useState ,useEffect,useContext} from "react";
import axios from 'axios';
import PropTypes from 'prop-types';
import { useNavigate ,useParams } from "react-router-dom";
import { Paper, Typography, Grid, Divider, Box, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Radio, RadioGroup, FormControlLabel, TextField, Button, Avatar } from "@mui/material";
import "./SpocApproval.css";
import AuthContext from "../Auth/AuthContext";
import formatDate from "../../utils/dateUtils";
import removeHtmlTags from "../../utils/htmlUtils";
import { arrayBufferToBase64 } from '../../utils/ImgConveter';
import { io } from "socket.io-client";  
import { ChatContext } from '../context/ChatContext'; // Import ChatContext
 
const SpocApproval = ({roleId}) => {
const [learners, setLearners] = useState([]);
const [action, setAction] = useState("approve");
const navigate = useNavigate();
const { requestid } = useParams();
const { user } = useContext(AuthContext);
const { messages, sendMessage, newMessage, setNewMessage } = useContext(ChatContext);
const [comments, setComments] = useState([]);
const [userProfiles, setUserProfiles] = useState({});
const [latestCommentId, setLatestCommentId] = useState(null);
const [requestDetails, setRequestDetails] = useState(null);
 
const [socket, setSocket] = useState(null);
 
useEffect(() => {
  const fetchData = async () => {
    try {
      const requestResponse = await fetch(`http://localhost:8000/api/training-request/${requestid}`);
      const requestdata = await requestResponse.json();
      setRequestDetails(requestdata);
      console.log('Request Details:', requestdata);

      const learnerResponse = await fetch(`http://localhost:8000/api/getEmpNewTrainingRequested/getEmpNewTrainingRequested?requestid=${requestid}`);
      const learnerdata = await learnerResponse.json();
      
      const updatedLearners = learnerdata.map((learner) => {
        if (learner.profile_image && learner.profile_image.data) {
          const base64Flag = `data:image/jpeg;base64,${arrayBufferToBase64(learner.profile_image.data)}`;
          return { ...learner, profile_image: base64Flag };
        }
        return learner;
      });

      setLearners(updatedLearners);
      console.log('Learners Data:', updatedLearners);

      const commentsResponse = await fetch(`http://localhost:8000/api/comments/${requestid}`);
      const commentsdata = await commentsResponse.json();
      setComments(commentsdata);
      console.log('Fetched Comments:', commentsdata);

      if (commentsdata.length > 0) {
        const latestComment = commentsdata.reduce((latest, comment) =>
          new Date(comment.created_date) > new Date(latest.created_date) ? comment : latest
        );
        setLatestCommentId(latestComment.comment_id);
      }

      const userIds = new Set();
      commentsdata.forEach(comment => {
        if (comment.created_by) userIds.add(comment.created_by);
      });

      const profiles = {};
      for (let userId of userIds) {
        const userResponse = await fetch(`http://localhost:8000/api/getempdetails/getEmpbasedOnId/${userId}`);
        const userData = await userResponse.json();
        console.log(`User Data for ${userId}:`, userData);
        if (userData && userData.length > 0) {
          if (userData[0]?.profile_image?.data) {
            const base64Image = `data:image/jpeg;base64,${arrayBufferToBase64(userData[0].profile_image.data)}`;
            userData[0].profile_image = base64Image;
          }
          profiles[userId] = userData[0];
        } else {
          profiles[userId] = { emp_name: 'Unknown', profile_image: '/default-avatar.png' };
        }
      }
      setUserProfiles(profiles);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchData();
}, [requestid]);
 
const sortedComments = comments.sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
 
useEffect(() => {
  const updatedLearners = learners.map(learner => {
    if (learner.profile_image && learner.profile_image.data) {
      const base64Flag = `data:image/jpeg;base64,${arrayBufferToBase64(learner.profile_image.data)}`;
      if (learner.profile_image !== base64Flag) {
        return { ...learner, profile_image: base64Flag };
      }
    }
    return learner;
  });
  setLearners(updatedLearners);
}, [learners.length]);
 
useEffect(() => {
  const socketConnection = io("http://localhost:8000");
  setSocket(socketConnection);
 
  return () => {
    socketConnection.disconnect();
  };
}, []);
 
const handleSubmit = async () => {
  if (action === "Need Clarification" && !newMessage.trim()) {
    alert("Comment text is empty!");
    return;
  }
 
  const requestData = {
    requestId: requestDetails?.requestid,
    status: action,
    roleId: roleId,
    approverId: user.emp_id,
  };
 
  const commentdata = {
    requestid: requestDetails?.requestid,
    comment_text: newMessage,
    parent_comment_id: latestCommentId || null,
    created_by: user.emp_id,
    requestStatus: "Approval Requested",
  };
 
  try {
    const statusResponse = await fetch("http://localhost:8000/api/request-status/update-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });
 
    const statusData = await statusResponse.json();
    if (statusResponse.ok) {
      console.log("API call successful:", statusData);
      alert("Status updated successfully!");
    } else {
      console.error("Error in API call:", statusData);
      alert("Error updating status.");
    }
  } catch (error) {
    console.error("Error updating status:", error);
    alert("An error occurred while updating status.");
  }
 
  if (action === "needClarification" && newMessage.trim()) {
    try {
      const commentResponse = await fetch("http://localhost:8000/api/comments/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentdata),
      });
      console.log(commentResponse);
      if (commentResponse.ok) {
        console.log("Comment Added Successfully");
        setNewMessage('');
      } else {
        console.error("Error adding comment:", await commentResponse.json());
      }
    } catch (err) {
      console.error("Error adding comment:", err);
    }
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
                    Techstack / Area:
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
              <h2 style={{ fontSize: "12px", marginBottom: "1rem" }}>{learners.length} Learner(s) are allocated to this learning request</h2>
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
      <TableRow key={learner.emp_id}>
        <TableCell style={{ padding: "8px", fontSize: "12px" }}>
          {learner.emp_id}
        </TableCell>
        <TableCell style={{ padding: "8px", fontSize: "12px" }}>
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar alt="User" src={learner.profile_image} /> {/* Use the base64-encoded image */}
            {learner.emp_name}
          </Box>
        </TableCell>
        <TableCell style={{ padding: "8px", fontSize: "12px" }}>
          {formatDate(learner.availablefrom)}
        </TableCell>
        <TableCell style={{ padding: "8px", fontSize: "12px" }}>
          {learner.dailyband}
        </TableCell>
        <TableCell style={{ padding: "8px", fontSize: "12px" }}>
          {learner.availableonweekend === 1 ? "Yes" : "No"}
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
<Box
  display="flex"
  flexDirection="column"
  gap={2}
  paddingLeft={5}
  style={{ height: '400px', overflowY: 'auto' }} // Add this line
>
  {sortedComments.length > 0 ? (
    sortedComments.map((comment) => {
      console.log('Rendering Comment:', comment); // Add this line to log each comment being rendered
      return (
        <div key={comment.comment_id} className="user-profile" style={{ marginBottom: '16px' }}>
          <div className="avatar-name" style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <Avatar
              alt="User"
              src={userProfiles[comment.created_by]?.profile_image || '/default-avatar.png'}
              style={{ marginRight: '8px' }}
            />
            <Typography className="typography-value-upper">
              {userProfiles[comment.created_by]?.emp_name || 'Unknown'}
            </Typography>
          </div>
          <Typography className="typography-value-upper" style={{ marginBottom: '8px' }}>
            {comment.comment_text}
          </Typography>
          <Typography className="typography-label-upper" style={{ fontSize: '0.85rem' }}>
            {new Date(comment.created_date).toLocaleString()}
          </Typography>
        </div>
      );
    })
  ) : (
    <Typography>No comments available.</Typography>
  )}
</Box>
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
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
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
 