import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Grid2 , Card, CardContent, Typography, Divider } from "@mui/material";
import { styled } from "@mui/material/styles";
import formatDate from "../../utils/dateUtils";
import removeHtmlTags from "../../utils/htmlUtils";
 
const InfoLabel = styled(Typography)({
  color: "#666666",
  fontSize: "0.875rem",
  marginBottom: "4px",
  fontWeight: 400,
});
 
const InfoValue = styled(Typography)({
  fontSize: "1rem",
  fontWeight: 500,
  color: "#000000",
});
 
const StyledCard = styled(Card)({
  boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
  borderRadius: "8px",
  backgroundColor: "#ffffff",
});
 
const RequestInformation = () => {
  const { requestId } = useParams();
  const [requestData, setRequestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        const response = await fetch(
          `${backendUrl}api/training-request/${requestId}`
        );
        if (!response.ok) throw new Error('Failed to fetch request details');
        const data = await response.json();
        setRequestData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
 
    fetchRequestDetails();
  }, [requestId]);
 
  if (loading) return <Typography>Loading request details...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;
 
  return (
    <StyledCard sx={{ marginBottom: "20px" }}>
      <CardContent >
        {/* First Grid2 Layout */}
        <Grid2 container spacing={6} sx={{ display: "flex", justifyContent: "center" }}>
          <Grid2 item size={2}>
            <InfoLabel>Request ID/No:</InfoLabel>
            <InfoValue>LR {requestData.requestid}</InfoValue>
          </Grid2>
          <Grid2 item size={2}>
            <InfoLabel>Request by:</InfoLabel>
            <InfoValue>{requestData.requestedby}</InfoValue>
          </Grid2>
          <Grid2 item size={2}>
            <InfoLabel >Project:</InfoLabel>
            <InfoValue style={{textAlign:"left"}}>{requestData.project}</InfoValue>
          </Grid2>
          <Grid2 item size={2}>
            <InfoLabel>Service Division</InfoLabel>
            <InfoValue>{requestData.service_division}</InfoValue>
          </Grid2>
          <Grid2 item size={2}>
            <InfoLabel>Expected Completion</InfoLabel>
            <InfoValue>{formatDate(requestData.expecteddeadline)}</InfoValue>
          </Grid2>
          <Grid2 item size={2}>
            <InfoLabel>Techstack / Area</InfoLabel>
            <InfoValue>{requestData.techstack}</InfoValue>
          </Grid2>
        </Grid2>
 
        {/* Second Grid2 Layout */}
        <Grid2 container spacing={5}  sx={{marginTop: "30px"}}>
          <Grid2 item size={4}>
            <InfoLabel>Primary Skills / Competencies</InfoLabel>
            <InfoValue>
              {requestData.primarySkills?.map((skill, index) => (
                <div key={index}>{skill}</div>
              ))}
            </InfoValue>
          </Grid2>
          <Grid2 item size={4}>
            <InfoLabel>Other Skill Information in Details</InfoLabel>
            <InfoValue>{removeHtmlTags(requestData.otherskill)}</InfoValue>
          </Grid2>
          <Grid2 item size={4}>
            <InfoLabel>Completion Criteria</InfoLabel>
            <InfoValue>{removeHtmlTags(requestData.suggestedcompletioncriteria)}</InfoValue>
          </Grid2>
        </Grid2>
 
        {/* Comments Box */}
        <Box size={12} sx={{ marginTop: "20px" }}>
          <InfoLabel>Comments</InfoLabel>
          <InfoValue>{removeHtmlTags(requestData.comments)}</InfoValue>
        </Box>
      </CardContent>
    </StyledCard>
  );
};
 
export default RequestInformation;