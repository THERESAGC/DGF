import {  useState ,useEffect,} from "react";
import PropTypes from 'prop-types';
import { useParams } from "react-router-dom";
import { Paper, Typography, Grid2, Divider, Box, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar } from "@mui/material";
import "../Training/Requesterinformation.css";
import formatDate from "../../utils/dateUtils";
import removeHtmlTags from "../../utils/htmlUtils";
import { arrayBufferToBase64 } from '../../utils/ImgConveter';


const Requesterinformation = () => {
  
const [learners, setLearners] = useState([]);
const { requestId } = useParams();
const [comments, setComments] = useState([]);
const [userProfiles, setUserProfiles] = useState({});
const [requestDetails, setRequestDetails] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      const requestResponse = await fetch(`http://localhost:8000/api/training-request/${requestId}`);
      const requestdata = await requestResponse.json();
      setRequestDetails(requestdata);
      console.log('Request Details:', requestdata);
      console.log('Request IDdddd:', requestId);
      

      const learnerResponse = await fetch(`http://localhost:8000/api/getEmpNewTrainingRequested/getEmpNewTrainingRequested/?requestid=${requestId}`);
      const learnerdata = await learnerResponse.json();
      setLearners(learnerdata.employees || []);
      console.log('Learners Data:', learnerdata);

      const commentsResponse = await fetch(`http://localhost:8000/api/comments/${requestId}`);
      const commentsdata = await commentsResponse.json();
      setComments(commentsdata);
      console.log('Fetched Comments:', commentsdata); // Add this line to log fetched comments

   

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
}, [requestId]);

const sortedComments = comments.sort((a, b) => new Date(a.created_date) - new Date(b.created_date));

useEffect(() => {
  if (Array.isArray(learners)) {
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
}
}, [learners.length]);


  return (
    <>
    <Box justifyContent="space-between" >
      <Typography fullWidth variant="h5" gutterBottom className="mainHeading" style={{ fontWeight: "bold", fontSize: "14px",paddingLeft: "32px"}}>
        Learning Details
      </Typography>
      <Divider style={{ margin: "1rem 5px 1rem 2px ",width:"101%"}} />
    </Box>

    <Paper elevation={1} className="paper" style={{ height: "100%", width: "95%" }}>
      <div className="inner-container">
        <Box style={{ padding: "10px", marginTop: "1rem" }}>
          <Grid2 container spacing={5}>
            <Grid2 item size={4}>
              <FormControl fullWidth className="form-control" style={{ marginBottom: "1rem" }}>
                <Typography className="typography-label-upper">
                  Request ID/No:
                </Typography>
                <Typography className="typography-value-upper">
                #{requestDetails?.requestid}
                </Typography>
              </FormControl>
            </Grid2>
            <Grid2 item size={4}>
              <FormControl fullWidth className="form-control">
                <Typography className="typography-label-upper">
                  Request By:
                </Typography>
                <Typography className="typography-value-upper">
                {requestDetails?.requestedby}
                </Typography>
              </FormControl>
            </Grid2>
            <Grid2 item size={4}>
              <FormControl fullWidth className="form-control">
                <Typography className="typography-label-upper">
                  Project:
                </Typography>
                <Typography className="typography-value-upper">
                 {requestDetails?.newprospectname || requestDetails?.project}            
                </Typography>
              </FormControl>
            </Grid2>
          </Grid2>
          <Grid2 container spacing={5} style={{ marginTop: "1rem" }}>
            <Grid2 item size={4}>
              <FormControl fullWidth className="form-control">
                <Typography className="typography-label-upper">
                  Service Division:
                </Typography>
                <Typography className="typography-value-upper">
                {requestDetails?.service_division}
                </Typography>
              </FormControl>
            </Grid2>
            <Grid2 item size={4}>
              <FormControl fullWidth className="form-control">
                <Typography className="typography-label-upper">
                  Expected Completion:
                </Typography>
                <Typography className="typography-value-upper">
                  {formatDate(requestDetails?.expecteddeadline)  }                  
                </Typography>
              </FormControl>
            </Grid2>
            <Grid2 item size={4}>
              <FormControl fullWidth className="form-control">
                <Typography className="typography-label-upper">
                  Techstack / Area:
                </Typography>
                <Typography className="typography-value-upper">
                  {requestDetails?.techstack}
                </Typography>
              </FormControl>
            </Grid2>
          </Grid2>
          <Grid2 container spacing={2} style={{ marginTop: "1.5rem" }}>
<Grid2 item size={4} >
  <FormControl fullwidth="true" className="form-control">
    <Typography className="typography-label-upper">
      Primary Skills :
    </Typography>
    <div className="typography-value-upper">
      {requestDetails?.primarySkills && requestDetails?.primarySkills.length > 0 ? (
        <ul style={{ paddingLeft: '20px' }}>
          {requestDetails?.primarySkills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      ) : (
        <Typography className="typography-value-upper">No skills available</Typography>
      )}
    </div>
  </FormControl>
</Grid2>
</Grid2>
        </Box>
        <Divider className="divider" style={{ marginTop: "1rem", marginBottom: "1rem" }} />
        <Box>
          <Grid2 container spacing={2} style={{ marginTop: "0.5rem" }}>
            <Grid2 item size={4}>
              <FormControl fullWidth className="form-control">
                <Typography className="typography-label-upper">
                  Other Skill Information in Details:
                </Typography>
                <Typography className="typography-value-upper">
                 { removeHtmlTags(requestDetails?.otherskill)}
                </Typography>
              </FormControl>
            </Grid2>
            <Grid2 item size={4}>
              <FormControl fullWidth className="form-control" style={{ marginBottom: "1rem", display: "flex", alignItems: "center" }}>
                <Typography className="typography-label-upper">
                  Completion Criteria:
                </Typography>
                <Typography  className="typography-value-upper"
style={{ fontSize: "12px", display: "flex", alignItems: "center" }}>
  {removeHtmlTags(requestDetails?.suggestedcompletioncriteria)}
  </Typography>

              </FormControl>
            </Grid2>
          </Grid2>
          <Grid2 container spacing={2} style={{ marginTop: "1rem" }}>
            <Grid2 item size={12}>
              <FormControl fullWidth className="form-control">
                <Typography className="typography-label-upper">
                  Comments:
                </Typography>
                <Typography  className="typography-value-upper"  style={{ fontSize: "12px", display: "flex", alignItems: "center" }}>
                  {removeHtmlTags(requestDetails?.comments)}
                </Typography>


              </FormControl>
            </Grid2>
          </Grid2>
        </Box>
        <Divider className="divider" style={{ marginTop: "1rem", marginBottom: "1rem" }} />
        <Box>
          <div style={{ maxWidth: "100%", margin: "auto", padding: 20 }}>
            <h2 style={{ fontSize: "12px", marginBottom: "1rem" }}>{learners.length} Learner(s) are allocated to this learning request</h2>
            <TableContainer
              component={Paper}
              style={{ padding: "16px", marginTop: "16px", maxWidth: "97%" , marginLeft:"-18px" }} elevation={0}
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
         
          </div>
          <Box
            display="flex"
            flexDirection="column"
            gap={2}
            paddingLeft={5}
            style={{ height: '300px', overflowY: 'auto' }} // Add this line
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
                      {formatDate(comment.created_date)}
                    </Typography>
                  </div>
                );
              })
            ) : (
              <Typography>No comments available.</Typography>
            )}
          </Box>
        </Box>
      </div>
    </Paper>
  </>
  );
};
 
Requesterinformation.propTypes = {
  roleId: PropTypes.number.isRequired,
};
 
export default Requesterinformation;
