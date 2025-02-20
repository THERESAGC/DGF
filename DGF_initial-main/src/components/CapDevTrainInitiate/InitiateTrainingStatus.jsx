
import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
} from "@mui/material";
import "./InitiateTrainingStatus.css";

const InitiateTrainingStatus = () => {
  return (
    
    <Box className="training-container">
      
      {/* <Typography
        variant="h5"
        gutterBottom
        className="mainHeading"
        style={{ fontWeight: "bold", fontSize: "14px", paddingRight: "518px" }}
      >
        Initiate Learning
      </Typography> */}
    <div>
      <Typography
        variant="h5"
        gutterBottom
        className="mainHeading"
        style={{ fontWeight: "bold", fontSize: "14px", paddingRight: "518px" }}
      >
        Initiate Learning
      </Typography>
    </div>
      {/* Horizontal line after the Initiate Learning box */}
      <hr className="divider-line" />

      <Paper className="training-details-paper">
        <Box className="content-box">
          <br />
          <Box display="flex" justifyContent="space-between" marginBottom={2}>
            <Typography><b>Request ID:</b> #123</Typography>
            <Typography><b>Requested by:</b> Joe Maison</Typography>
            <Typography><b>Project:</b> Walmart</Typography>
            <Typography><b>Service Division:</b> Tech service</Typography>
            <Typography><b>Expected Completion:</b> 31st Jan 2025</Typography>
            <Typography><b>Techstack/Area:</b> Front-end</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" marginBottom={2}>
            <Typography><b>Primary Skills:</b> Programming Knowledge</Typography>
            <Typography><b>Other Skill Information:</b> Tech service</Typography>
            <Typography><b>Completion Criteria:</b> Learn ipsum dolor sit amet, consectetur adipiscing elit</Typography>
          </Box>

          <Box>
            <Typography><b>Comments:</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default InitiateTrainingStatus;
