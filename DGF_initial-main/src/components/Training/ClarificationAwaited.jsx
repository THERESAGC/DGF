import React from "react";
import { Paper, Typography, Grid, Divider, Box, FormControl, Avatar } from "@mui/material";
import IconButton from '@mui/material/IconButton'; // Correct import for IconButton
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const ClarificationAwaited = () => {

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
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center">
          <IconButton style={{color: "black"}} > 
            <ArrowBackIosNewIcon />
          </IconButton>
          <Typography
            variant="h5"
            gutterBottom
            className="mainHeading"
            style={{ fontWeight: "bold", fontSize: "14px" }}
          >
            Learning Request
          </Typography>
        </Box>
        <Box
          style={{
            backgroundColor: "yellow",
            borderRadius: "10px",
            padding: "5px 10px",
          }}
        >
          <Typography variant="body1" style={{ fontWeight: "bold",backgroundColor: "#FCFBDA" }}>
            Clarification Awaited
          </Typography>
        </Box>
      </Box>

      <Paper elevation={1} className="paper" style={{ height: "100%", width: "85%" }}>
        <div className="inner-container">
          <Box style={{ padding: "10px", marginTop: "1rem" }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className="form-control" style={{ marginBottom: "1rem" }}>
                  <Typography className="typography-label-upper">Request ID/No:</Typography>
                  <Typography className="typography-value-upper">#1234</Typography>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className="form-control">
                  <Typography className="typography-label-upper">Request By:</Typography>
                  <Typography className="typography-value-upper">Joe Maison</Typography>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className="form-control">
                  <Typography className="typography-label-upper">Project:</Typography>
                  <Typography className="typography-value-upper">#Wallmart</Typography>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className="form-control">
                  <Typography className="typography-label-upper">Service Division:</Typography>
                  <Typography className="typography-value-upper">Tech Services</Typography>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className="form-control">
                  <Typography className="typography-label-upper">Expected Completion:</Typography>
                  <Typography className="typography-value-upper">31st Jan 2025</Typography>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className="form-control">
                  <Typography className="typography-label-upper">Techstack / Area:</Typography>
                  <Typography className="typography-value-upper">Front-end</Typography>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={2} style={{ marginTop: "1rem" }}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className="form-control">
                  <Typography className="typography-label-upper">Primary Skills / Competencies:</Typography>
                  <Typography className="typography-value-upper">Programming Knowledge</Typography>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          <Divider className="divider" style={{ marginTop: "1rem", marginBottom: "1rem" }} />
          <Box>
            <Grid container spacing={2} style={{ marginTop: "0.5rem" }}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className="form-control">
                  <Typography className="typography-label-upper">Other Skill Information in Details:</Typography>
                  <Typography className="typography-value-upper">Tech Services</Typography>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className="form-control">
                  <Typography className="typography-label-upper">Completion Criteria:</Typography>
                  <Typography className="typography-value-upper">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  </Typography>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={2} style={{ padding: "10px", marginTop: "1rem" }}>
              <Grid item xs={12}>
                <FormControl fullWidth className="form-control">
                  <Typography className="typography-label-upper">Comments:</Typography>
                  <Typography className="typography-value-upper">
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  </Typography>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          <Divider className="divider" style={{ marginTop: "1rem", marginBottom: "1rem" }} />
          <Box>
            <div style={{ maxWidth: "100%", margin: "auto", padding: 20 }}>
              <h2 style={{ fontSize: "12px", marginBottom: "1rem" }}>
                {learners.length} Learners are allocated to this learning request
              </h2>
              {/* Table and other content */}
            </div>
          </Box>
        </div>
      </Paper>
    </>
  );
};

export default ClarificationAwaited;
