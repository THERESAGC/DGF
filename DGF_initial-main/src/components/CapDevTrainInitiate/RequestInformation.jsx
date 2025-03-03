// components/CapDevTrainInitiate/RequestInformation.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Card, CardContent, Typography, Divider } from "@mui/material";
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
          `http://localhost:8000/api/training-request/${requestId}`
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
    <StyledCard sx={{ maxWidth: 1200, margin: "20px auto", p: 2 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ 
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: 2,
          mb: 2,
        }}>
          <Box>
            <InfoLabel>Request ID/No:</InfoLabel>
            <InfoValue>LR {requestData.requestid}</InfoValue>
          </Box>
          <Box>
            <InfoLabel>Request by:</InfoLabel>
            <InfoValue>{requestData.requestedby}</InfoValue>
          </Box>
          <Box>
            <InfoLabel>Project:</InfoLabel>
            <InfoValue>{requestData.project}</InfoValue>
          </Box>
          <Box>
            <InfoLabel>Service Division</InfoLabel>
            <InfoValue>{requestData.service_division}</InfoValue>
          </Box>
          <Box>
            <InfoLabel>Expected Completion</InfoLabel>
            <InfoValue>{formatDate(requestData.expecteddeadline)}</InfoValue>
          </Box>
          <Box>
            <InfoLabel>Techstack / Area</InfoLabel>
            <InfoValue>{requestData.techstack}</InfoValue>
          </Box>
        </Box>
 
        <Box sx={{ 
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 2,
          mb: 2,
        }}>
          <Box>
            <InfoLabel>Primary Skills / Competencies</InfoLabel>
            <InfoValue>
              {requestData.primarySkills?.map((skill, index) => (
                <div key={index}>{skill}</div>
              ))}
            </InfoValue>
          </Box>
          <Box>
            <InfoLabel>Other Skill Information in Details</InfoLabel>
            <InfoValue>{removeHtmlTags(requestData.otherskill)}</InfoValue>
          </Box>
          <Box>
            <InfoLabel>Completion Criteria</InfoLabel>
            <InfoValue>{removeHtmlTags(requestData.suggestedcompletioncriteria)}</InfoValue>
          </Box>
        </Box>
 
        <Box sx={{ mb: 2 }}>
          <InfoLabel>Comments</InfoLabel>
          <InfoValue>
            {removeHtmlTags(requestData.comments)}
          </InfoValue>
        </Box>
      </CardContent>
    </StyledCard>
  );
};
 
export default RequestInformation;
 