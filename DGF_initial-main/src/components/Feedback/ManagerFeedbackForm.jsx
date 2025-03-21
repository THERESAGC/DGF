import { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Container,
  Typography,
  TextField,
  Paper,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  styled,
} from "@mui/material";

const StyledPaper = styled(Paper)({
  padding: "24px",
  maxWidth: 600,
  margin: "0 auto",
  marginTop: "32px",
  marginBottom: "32px",
  overflowY: "auto", // Enable scrolling within the paper
  maxHeight: "calc(100vh - 64px)", // Adjust height to fit within the viewport
});

const FormSection = styled(Box)({
  marginBottom: "24px",
});

const GrayBox = styled(Box)({
  backgroundColor: "#f5f5f5",
  padding: "16px",
  marginBottom: "24px",
});

const ManagerFeedbackForm = ({
  directName = "Radhika Pathak",
  requestedBy = "Smruti Adyalkar",
  courseName = "Rebuild Your Basics- Project Management Blueprint",
}) => {
  const [formData, setFormData] = useState({
    demonstrateSkill: "",
    suggestions: "",
    instructions: "Awaiting",
    topicsCovered: "Awaiting",
    engagement: "Awaiting",
    programEngaging: "Awaiting",
    interaction: "Awaiting",
    areasOfImprovement: "Awaiting",
    overallExperience: "Awaiting",
    topicSuggestions: "Awaiting",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add your form submission logic here
  };

  return (
    <Container sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", overflowY: "auto" }}>
      <StyledPaper elevation={3}>
        <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: "bold", mb: 2 }}>
          Skill Enhancement Feedback Form
        </Typography>

        <form onSubmit={handleSubmit}>
          <FormSection>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
              Direct Name
            </Typography>
            <Typography>{directName}</Typography>
          </FormSection>

          <FormSection>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
              Requested By
            </Typography>
            <Typography>{requestedBy}</Typography>
          </FormSection>

          <FormSection>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
              Course/Training Name
            </Typography>
            <TextField fullWidth size="small" variant="outlined" value={courseName} disabled sx={{ mt: 1 }} />
          </FormSection>

          <FormSection>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
              Has the learner been given an opportunity to demonstrate the skill?
            </Typography>
            <RadioGroup name="demonstrateSkill" value={formData.demonstrateSkill} onChange={handleChange} row>
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </FormSection>

          <FormSection>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
              Any other suggestions/Comments/Recommendations for the next skill to be initiated
            </Typography>
            <TextField
              fullWidth
              helperText="Please provide your suggestions here"
              rows={4}
    
              variant="outlined"
              name="suggestions"
              value={formData.suggestions}
              onChange={handleChange}
            />
          </FormSection>

          <GrayBox>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
              Feedback received by the user
            </Typography>
            <Typography>{directName}</Typography>
            <Typography variant="caption" color="textSecondary">
              Received on: {new Date().toLocaleDateString()}
            </Typography>
          </GrayBox>

          <FormSection>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
              How were the instructions provided during the training? (4 is the highest)
            </Typography>
            <Typography color="textSecondary">- {formData.instructions}</Typography>
          </FormSection>

          <FormSection>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
              Were the topics covered till the extent expected?
            </Typography>
            <Typography color="textSecondary">- {formData.topicsCovered}</Typography>
          </FormSection>

          <FormSection>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
              How engaged were you during the session? (4 is the highest)
            </Typography>
            <Typography color="textSecondary">- {formData.engagement}</Typography>
          </FormSection>

          <FormSection>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
              Was the program engaging?
            </Typography>
            <Typography color="textSecondary">- {formData.programEngaging}</Typography>
          </FormSection>

          <FormSection>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
              How was the interaction in the program?
            </Typography>
            <Typography color="textSecondary">- {formData.interaction}</Typography>
          </FormSection>

          <FormSection>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
              Areas of improvement if any?
            </Typography>
            <Typography color="textSecondary">- {formData.areasOfImprovement}</Typography>
          </FormSection>

          <FormSection>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
              Your overall experience (4 is the highest)
            </Typography>
            <Typography color="textSecondary">- {formData.overallExperience}</Typography>
          </FormSection>

          <FormSection>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
              Topics/Areas that you would like to suggest for the next program?
            </Typography>
            <Typography color="textSecondary">- {formData.topicSuggestions}</Typography>
          </FormSection>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              bgcolor: "#009688",
              color: "white",
              "&:hover": {
                bgcolor: "#00796b",
              },
              py: 1,
              borderRadius: 2,
            }}
          >
            Submit Feedback
          </Button>
        </form>
        <Typography variant="caption" align="center" sx={{ display: "block", mt: 2, color: "gray" }}>
          Copyright Â© 2025 Harbinger Groups.
        </Typography>
      </StyledPaper>
    </Container>
  );
};

ManagerFeedbackForm.propTypes = {
  directName: PropTypes.string,
  requestedBy: PropTypes.string,
  courseName: PropTypes.string,
};

export default ManagerFeedbackForm;