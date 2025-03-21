import  { useState } from 'react';
import PropTypes from 'prop-types';

import { Box, Container, Typography, TextField, Paper, Button, Radio, RadioGroup, FormControlLabel, styled } from '@mui/material';
 
const StyledPaper = styled(Paper)({
  padding: '24px',
  maxWidth: 600,
  margin: '0 auto',
  marginTop: '32px',
  marginBottom: '32px',
  overflowY: 'auto', // Enable scrolling within the paper
  maxHeight: 'calc(100vh - 64px)', // Adjust height to fit within the viewport
});
 
const FormSection = styled(Box)({
  marginBottom: '24px',
});
 
// const GrayBox = styled(Box)({
//   backgroundColor: '#f5f5f5',
//   padding: '16px',
//   marginBottom: '24px',
// });
 
const UserFeedbackForm = ({ 
  username = "John Doe", 
  requestedby = "CAPDEV", 
  coursename = "Advanced React",
//   instructionRatings = "Awaiting",
//   trainingTopics = "Awaiting",
//   engagedRatings = "Awaiting",
//   interactives = "Awaiting",
//   interactiveComponents = "Awaiting",
//   engagedSessionRatings = "Awaiting",
//   improvedComments = "Awaiting",
//   otherSuggestions = "Awaiting",
}) => {
  const [formData, setFormData] = useState({
    // instructionRating: instructionRatings,
    // topicsCovered: trainingTopics,
    // engagementRating: engagedRatings,
    // programEngaging: interactives,
    // interactionRating: interactiveComponents,
    // areasImprovement: improvedComments,
    // overallExperience: engagedSessionRatings,
    // topicSuggestions: otherSuggestions,
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
    console.log('Form submitted:', formData);
    // Add your form submission logic here
  };
 
  return (
<Container sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', overflowY: 'auto' }}>
<StyledPaper elevation={3}>
<Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 2 }}>
          Skill Enhancement Feedback Form
</Typography>
 
        <form onSubmit={handleSubmit}>
<FormSection>
<Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Direct Name</Typography>
<Typography>{username}</Typography>
</FormSection>
 
          <FormSection>
<Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Requested By</Typography>
<Typography>{requestedby}</Typography>
</FormSection>
 
          <FormSection>
<Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Course/Training Name</Typography>
<TextField fullWidth size="small" variant="outlined" value={coursename} disabled sx={{ mt: 1 }} />
</FormSection>
 
          <FormSection>
<Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>How were the instructions provided during the training? (4 is the highest)</Typography>
<RadioGroup name="instructionRating" value={formData.instructionRating} onChange={handleChange} row>
<FormControlLabel value="4" control={<Radio />} label="4 - Very Good" />
<FormControlLabel value="3" control={<Radio />} label="3 - Good" />
<FormControlLabel value="2" control={<Radio />} label="2 - Interesting" />
<FormControlLabel value="1" control={<Radio />} label="1 - Average" />
</RadioGroup>
</FormSection>
 
          <FormSection>
<Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Were the topics covered till the extent expected?</Typography>
<RadioGroup name="topicsCovered" value={formData.topicsCovered} onChange={handleChange} row>
<FormControlLabel value="2" control={<Radio />} label="2 - Yes" />
<FormControlLabel value="1" control={<Radio />} label="1 - No" />
</RadioGroup>
</FormSection>
 
          <FormSection>
<Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>How engaged were you during the session? (4 is the highest)</Typography>
<RadioGroup name="engagementRating" value={formData.engagementRating} onChange={handleChange} row>
<FormControlLabel value="4" control={<Radio />} label="4 - Very Good" />
<FormControlLabel value="3" control={<Radio />} label="3 - Good" />
<FormControlLabel value="2" control={<Radio />} label="2 - Interesting" />
<FormControlLabel value="1" control={<Radio />} label="1 - Average" />
</RadioGroup>
</FormSection>
 
          <FormSection>
<Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Was the program engaging?</Typography>
<RadioGroup name="programEngaging" value={formData.programEngaging} onChange={handleChange} row>
<FormControlLabel value="2" control={<Radio />} label="2 - Yes" />
<FormControlLabel value="1" control={<Radio />} label="1 - No" />
</RadioGroup>
</FormSection>
 
          <FormSection>
<Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>How was the interaction in the program?</Typography>
<RadioGroup name="interactionRating" value={formData.interactionRating} onChange={handleChange} row>
<FormControlLabel value="3" control={<Radio />} label="3 - More" />
<FormControlLabel value="2" control={<Radio />} label="2 - Less" />
<FormControlLabel value="1" control={<Radio />} label="1 - Some" />
</RadioGroup>
</FormSection>
 
          <FormSection>
<Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Areas of improvement if any?</Typography>
<TextField fullWidth multiline rows={4} variant="outlined" name="areasImprovement" value={formData.areasImprovement} onChange={handleChange} />
</FormSection>
 
          <FormSection>
<Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Your overall experience (4 is the highest)</Typography>
<RadioGroup name="overallExperience" value={formData.overallExperience} onChange={handleChange} row>
<FormControlLabel value="4" control={<Radio />} label="4 - Very Good" />
<FormControlLabel value="3" control={<Radio />} label="3 - Good" />
<FormControlLabel value="2" control={<Radio />} label="2 - Interesting" />
<FormControlLabel value="1" control={<Radio />} label="1 - Average" />
</RadioGroup>
</FormSection>
 
          <FormSection>
<Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Topics/Areas that you would like to suggest for the next program?</Typography>
<TextField fullWidth multiline rows={4} variant="outlined" name="topicSuggestions" value={formData.topicSuggestions} onChange={handleChange} />
</FormSection>
 
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              bgcolor: '#009688',
              color: 'white',
              '&:hover': {
                bgcolor: '#00796b',
              },
              py: 1,
              borderRadius: 2,
            }}
>
            Submit Feedback
</Button>
</form>
 
        <Typography variant="caption" align="center" sx={{ display: 'block', mt: 2, color: 'gray' }}>
          Copyright © 2025 Harbinger Groups.
</Typography>
</StyledPaper>
</Container>
  );
};
UserFeedbackForm.propTypes = {
  username: PropTypes.string.isRequired,
  requestedby: PropTypes.string.isRequired,
  coursename: PropTypes.string.isRequired,
  instructionRatings: PropTypes.string,
  trainingTopics: PropTypes.string,
  engagedRatings: PropTypes.string,
  interactives: PropTypes.string,
  interactiveComponents: PropTypes.string,
  engagedSessionRatings: PropTypes.string,
  improvedComments: PropTypes.string,
  otherSuggestions: PropTypes.string,
  dateSubmitted: PropTypes.string,
};

export default UserFeedbackForm;
