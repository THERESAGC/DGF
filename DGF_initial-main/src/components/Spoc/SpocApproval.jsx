import { useContext, useState } from "react";
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import { Paper, Typography, Grid, Divider, Box, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Radio, RadioGroup, FormControlLabel, TextField, Button, Avatar } from "@mui/material";
import "./SpocApproval.css";
import AuthContext from "../Auth/AuthContext";
const SpocApproval = ({roleId}) => {
  const [action, setAction] = useState("approve");
  const [comments, setComments] = useState("");
  const navigate = useNavigate();
  const {user} = useContext(AuthContext);
  const learners = [
    {
      id: "HS158",
      name: "Jonathan Hart",
      availableFrom: "15th Jan, 2025",
      bandwidth: "4hrs",
      weekend: "No",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      id: "HS333",
      name: "Joel Davis",
      availableFrom: "15th Jan, 2025",
      bandwidth: "4hrs",
      weekend: "No",
      image: "https://randomuser.me/api/portraits/men/4.jpg",
    },
    {
      id: "HS455",
      name: "Alan Patel",
      availableFrom: "15th Jan, 2025",
      bandwidth: "4hrs",
      weekend: "No",
      image: "https://randomuser.me/api/portraits/men/3.jpg",
    },
    // Add more learners as needed
  ];
 
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
                    #1234
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className="form-control">
                  <Typography className="typography-label-upper">
                    Request By:
                  </Typography>
                  <Typography className="typography-value-upper">
                    Joe Maison
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className="form-control">
                  <Typography className="typography-label-upper">
                    Project:
                  </Typography>
                  <Typography className="typography-value-upper">
                    #Wallmart
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
                    Tech Services
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className="form-control">
                  <Typography className="typography-label-upper">
                    Expected Completion:
                  </Typography>
                  <Typography className="typography-value-upper">
                    31st Jan 2025
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className="form-control">
                  <Typography className="typography-label-upper">
                    Techstack / Area:
                  </Typography>
                  <Typography className="typography-value-upper">
                    Front-end
                  </Typography>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2} style={{ marginTop: "1rem" }}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className="form-control">
                  <Typography className="typography-label-upper">
                    Primary Skills / Compentencies:
                  </Typography>
                  <Typography className="typography-value-upper">
                    Programming Knowledge
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
                    Tech Services
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className="form-control" style={{ marginBottom: "1rem", display: "flex", alignItems: "center" }}>
                  <Typography className="typography-label-upper">
                    Completion Criteria:
                  </Typography>
                  <Typography className="typography-value-upper" style={{ fontSize: "12px", display: "flex", alignItems: "center" }}>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eum nihil alias consequatur modi corrupti, rem tenetur corporis molestias aperiam, quasi quibusdam
                    soluta assumenda, deleniti aliquam sequi rerum
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
                  <Typography className="typography-value-upper" style={{ fontSize: "12px", display: "flex", alignItems: "center" }}>
                    Lorem ipsum dolor, sit amet consectetur adipisicing
                    elit. Ab, officiis aliquid asperiores explicabo odit
                    illum mollitia eligendi sequi ullam nisi praesentium
                    quod, impedit voluptates facilis architecto similique
                    debitis quae error sint corporis ad reiciendis? Beatae
                    commodi eveniet corporis, recusandae eos, dolore
                    dignissimos eum necessitatibus repellat facilis
                    impedit perspiciatis quidem aliquam!
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
                    {learners.map((learner) => (
                      <TableRow key={learner.id}>
                        <TableCell style={{ padding: "8px", fontSize: "12px" }}>
                          {learner.id}
                        </TableCell>
                        <TableCell style={{ padding: "8px", fontSize: "12px" }}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Avatar src={learner.image} />
                            {learner.name}
                          </Box>
                        </TableCell>
                        <TableCell style={{ padding: "8px", fontSize: "12px" }}>
                          {learner.availableFrom}
                        </TableCell>
                        <TableCell style={{ padding: "8px", fontSize: "12px" }}>
                          {learner.bandwidth}
                        </TableCell>
                        <TableCell style={{ padding: "8px", fontSize: "12px" }}>
                          {learner.weekend}
                        </TableCell>
                      </TableRow>
                    ))}
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
                  // onClick={handleSubmit}
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