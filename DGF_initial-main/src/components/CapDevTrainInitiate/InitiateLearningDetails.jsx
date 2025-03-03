// components/CapDevTrainInitiate/InitiateLearningDetails.jsx
import InitiateLearningAssignCourse from './InitiateLearningAssignCourse';
import RequestInformation from './RequestInformation';
import { Divider, Typography } from "@mui/material";
import { Box } from '@mui/material';
 
const InitiateLearningDetails = () => {
  return (
    <Box style={{ padding: "20px 20px 20px 20px" }}>
      <Typography style={{ fontWeight: "bold", fontSize: "16px" }}>
        Learning Details
      </Typography>
      <Divider style={{ margin: "0.5rem 0" }}/>
      <RequestInformation />
      <InitiateLearningAssignCourse />
    </Box>
  );
};
 
export default InitiateLearningDetails;