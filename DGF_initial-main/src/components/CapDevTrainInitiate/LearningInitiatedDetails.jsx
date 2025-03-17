import { Box } from '@mui/material';
import AssignCourseAccordion from './LearningInitiatedAssignCourse';
import RequestInformation from './RequestInformation';

import { Divider, Typography } from "@mui/material";

const LearningDetails = () => {
  return (
      <Box style={{ padding: "20px 14px 0px 14px" ,
      marginBottom: "50px",
      }}>
      <Typography
      style={{ fontWeight: "bold", fontSize: "16px" }}>
      Learning Details
    </Typography> 
    <Divider style={{ margin: "0.5rem 0" }}/>

      <RequestInformation />        
      <AssignCourseAccordion />
      </Box>
  );
};

export default LearningDetails;