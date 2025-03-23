// import  { useState } from 'react';
// import PropTypes from 'prop-types';

// import { Box, Container, Typography, TextField, Paper, Button, Radio, RadioGroup, FormControlLabel, styled } from '@mui/material';
 
// const StyledPaper = styled(Paper)({
//   padding: '24px',
//   maxWidth: 600,
//   margin: '0 auto',
//   marginTop: '32px',
//   marginBottom: '32px',
//   overflowY: 'auto', // Enable scrolling within the paper
//   maxHeight: 'calc(100vh - 64px)', // Adjust height to fit within the viewport
// });
 
// const FormSection = styled(Box)({
//   marginBottom: '24px',
// });
 
// // const GrayBox = styled(Box)({
// //   backgroundColor: '#f5f5f5',
// //   padding: '16px',
// //   marginBottom: '24px',
// // });
 
// const UserFeedbackForm = ({ 
//   username = "John Doe", 
//   requestedby = "CAPDEV", 
//   coursename = "Advanced React",
// //   instructionRatings = "Awaiting",
// //   trainingTopics = "Awaiting",
// //   engagedRatings = "Awaiting",
// //   interactives = "Awaiting",
// //   interactiveComponents = "Awaiting",
// //   engagedSessionRatings = "Awaiting",
// //   improvedComments = "Awaiting",
// //   otherSuggestions = "Awaiting",
// }) => {
//   const [formData, setFormData] = useState({
//     // instructionRating: instructionRatings,
//     // topicsCovered: trainingTopics,
//     // engagementRating: engagedRatings,
//     // programEngaging: interactives,
//     // interactionRating: interactiveComponents,
//     // areasImprovement: improvedComments,
//     // overallExperience: engagedSessionRatings,
//     // topicSuggestions: otherSuggestions,
//   });
 
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };
 
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Form submitted:', formData);
//     // Add your form submission logic here
//   };
 
//   return (
// <Container sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', overflowY: 'auto' }}>
// <StyledPaper elevation={3}>
// <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 2 }}>
//           Skill Enhancement Feedback Form
// </Typography>
 
//         <form onSubmit={handleSubmit}>
// <FormSection>
// <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Direct Name</Typography>
// <Typography>{username}</Typography>
// </FormSection>
 
//           <FormSection>
// <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Requested By</Typography>
// <Typography>{requestedby}</Typography>
// </FormSection>
 
//           <FormSection>
// <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Course/Training Name</Typography>
// <TextField fullWidth size="small" variant="outlined" value={coursename} disabled sx={{ mt: 1 }} />
// </FormSection>
 
//           <FormSection>
// <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>How were the instructions provided during the training? (4 is the highest)</Typography>
// <RadioGroup name="instructionRating" value={formData.instructionRating} onChange={handleChange} row>
// <FormControlLabel value="4" control={<Radio />} label="4 - Very Good" />
// <FormControlLabel value="3" control={<Radio />} label="3 - Good" />
// <FormControlLabel value="2" control={<Radio />} label="2 - Interesting" />
// <FormControlLabel value="1" control={<Radio />} label="1 - Average" />
// </RadioGroup>
// </FormSection>
 
//           <FormSection>
// <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Were the topics covered till the extent expected?</Typography>
// <RadioGroup name="topicsCovered" value={formData.topicsCovered} onChange={handleChange} row>
// <FormControlLabel value="2" control={<Radio />} label="2 - Yes" />
// <FormControlLabel value="1" control={<Radio />} label="1 - No" />
// </RadioGroup>
// </FormSection>
 
//           <FormSection>
// <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>How engaged were you during the session? (4 is the highest)</Typography>
// <RadioGroup name="engagementRating" value={formData.engagementRating} onChange={handleChange} row>
// <FormControlLabel value="4" control={<Radio />} label="4 - Very Good" />
// <FormControlLabel value="3" control={<Radio />} label="3 - Good" />
// <FormControlLabel value="2" control={<Radio />} label="2 - Interesting" />
// <FormControlLabel value="1" control={<Radio />} label="1 - Average" />
// </RadioGroup>
// </FormSection>
 
//           <FormSection>
// <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Was the program engaging?</Typography>
// <RadioGroup name="programEngaging" value={formData.programEngaging} onChange={handleChange} row>
// <FormControlLabel value="2" control={<Radio />} label="2 - Yes" />
// <FormControlLabel value="1" control={<Radio />} label="1 - No" />
// </RadioGroup>
// </FormSection>
 
//           <FormSection>
// <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>How was the interaction in the program?</Typography>
// <RadioGroup name="interactionRating" value={formData.interactionRating} onChange={handleChange} row>
// <FormControlLabel value="3" control={<Radio />} label="3 - More" />
// <FormControlLabel value="2" control={<Radio />} label="2 - Less" />
// <FormControlLabel value="1" control={<Radio />} label="1 - Some" />
// </RadioGroup>
// </FormSection>
 
//           <FormSection>
// <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Areas of improvement if any?</Typography>
// <TextField fullWidth multiline rows={4} variant="outlined" name="areasImprovement" value={formData.areasImprovement} onChange={handleChange} />
// </FormSection>
 
//           <FormSection>
// <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Your overall experience (4 is the highest)</Typography>
// <RadioGroup name="overallExperience" value={formData.overallExperience} onChange={handleChange} row>
// <FormControlLabel value="4" control={<Radio />} label="4 - Very Good" />
// <FormControlLabel value="3" control={<Radio />} label="3 - Good" />
// <FormControlLabel value="2" control={<Radio />} label="2 - Interesting" />
// <FormControlLabel value="1" control={<Radio />} label="1 - Average" />
// </RadioGroup>
// </FormSection>
 
//           <FormSection>
// <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Topics/Areas that you would like to suggest for the next program?</Typography>
// <TextField fullWidth multiline rows={4} variant="outlined" name="topicSuggestions" value={formData.topicSuggestions} onChange={handleChange} />
// </FormSection>
 
//           <Button
//             type="submit"
//             variant="contained"
//             fullWidth
//             sx={{
//               bgcolor: '#009688',
//               color: 'white',
//               '&:hover': {
//                 bgcolor: '#00796b',
//               },
//               py: 1,
//               borderRadius: 2,
//             }}
// >
//             Submit Feedback
// </Button>
// </form>
 
//         <Typography variant="caption" align="center" sx={{ display: 'block', mt: 2, color: 'gray' }}>
//           Copyright © 2025 Harbinger Groups.
// </Typography>
// </StyledPaper>
// </Container>
//   );
// };
// UserFeedbackForm.propTypes = {
//   username: PropTypes.string.isRequired,
//   requestedby: PropTypes.string.isRequired,
//   coursename: PropTypes.string.isRequired,
//   instructionRatings: PropTypes.string,
//   trainingTopics: PropTypes.string,
//   engagedRatings: PropTypes.string,
//   interactives: PropTypes.string,
//   interactiveComponents: PropTypes.string,
//   engagedSessionRatings: PropTypes.string,
//   improvedComments: PropTypes.string,
//   otherSuggestions: PropTypes.string,
//   dateSubmitted: PropTypes.string,
// };

// export default UserFeedbackForm;
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Container, Typography, TextField, Paper, Button, Radio, RadioGroup, FormControlLabel, styled } from '@mui/material';
import axios from 'axios'; // To make HTTP requests

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

const UserFeedbackForm = ({ username = "John Doe", requestedby = "CAPDEV", coursename = "Advanced React" }) => {
  const [formData, setFormData] = useState({
    instructionRating: "",
    topicsCovered: "",
    engagementRating: "",
    programEngaging: "",
    interactionRating: "",
    areasImprovement: "",
    overallExperience: "",
    topicSuggestions: ""
  });

  // Extract query parameters from the URL
  const [reqid, setReqid] = useState('');
  const [course_id, setCourseId] = useState('');
  const [employee_id, setEmployeeId] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setReqid(urlParams.get('reqid'));
    setCourseId(urlParams.get('course_id'));
    setEmployeeId(urlParams.get('employee_id'));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const feedbackPayload = {
      reqid,
      course_id,
      employee_id,
      instruction_rating: formData.instructionRating,
      training_topic: coursename,
      engaged_rating: formData.engagementRating,
      interactive: formData.programEngaging,
      interactive_components: formData.interactionRating,
      improved_comments: formData.areasImprovement,
      engaged_session_rating: formData.overallExperience,
      other_suggestions: formData.topicSuggestions
    };

    try {
      const response = await axios.post('http://localhost:8000/api/feedback', feedbackPayload);
      console.log('Feedback submitted successfully:', response.data);
      alert('Feedback submitted successfully!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Error submitting feedback.');
    }
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

          {/* Instruction Rating */}
          <FormSection>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>How were the instructions provided during the training? (4 is the highest)</Typography>
            <RadioGroup name="instructionRating" value={formData.instructionRating} onChange={handleChange} row>
              <FormControlLabel value="4" control={<Radio />} label="4 - Very Good" />
              <FormControlLabel value="3" control={<Radio />} label="3 - Good" />
              <FormControlLabel value="2" control={<Radio />} label="2 - Interesting" />
              <FormControlLabel value="1" control={<Radio />} label="1 - Average" />
            </RadioGroup>
          </FormSection>

          {/* Engagement Rating */}
          <FormSection>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>How engaged were you during the session? (4 is the highest)</Typography>
            <RadioGroup name="engagementRating" value={formData.engagementRating} onChange={handleChange} row>
              <FormControlLabel value="4" control={<Radio />} label="4 - Very Good" />
              <FormControlLabel value="3" control={<Radio />} label="3 - Good" />
              <FormControlLabel value="2" control={<Radio />} label="2 - Interesting" />
              <FormControlLabel value="1" control={<Radio />} label="1 - Average" />
            </RadioGroup>
          </FormSection>

          {/* Program Engaging */}
          <FormSection>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Was the program engaging?</Typography>
            <RadioGroup name="programEngaging" value={formData.programEngaging} onChange={handleChange} row>
              <FormControlLabel value="2" control={<Radio />} label="2 - Yes" />
              <FormControlLabel value="1" control={<Radio />} label="1 - No" />
            </RadioGroup>
          </FormSection>

          {/* Interaction Rating */}
          <FormSection>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>How was the interaction in the program?</Typography>
            <RadioGroup name="interactionRating" value={formData.interactionRating} onChange={handleChange} row>
              <FormControlLabel value="3" control={<Radio />} label="3 - More" />
              <FormControlLabel value="2" control={<Radio />} label="2 - Less" />
              <FormControlLabel value="1" control={<Radio />} label="1 - Some" />
            </RadioGroup>
          </FormSection>

          {/* Areas of Improvement */}
          <FormSection>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Areas of improvement if any?</Typography>
            <TextField fullWidth multiline rows={4} variant="outlined" name="areasImprovement" value={formData.areasImprovement} onChange={handleChange} />
          </FormSection>

          {/* Overall Experience */}
          <FormSection>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Your overall experience (4 is the highest)</Typography>
            <RadioGroup name="overallExperience" value={formData.overallExperience} onChange={handleChange} row>
              <FormControlLabel value="4" control={<Radio />} label="4 - Very Good" />
              <FormControlLabel value="3" control={<Radio />} label="3 - Good" />
              <FormControlLabel value="2" control={<Radio />} label="2 - Interesting" />
              <FormControlLabel value="1" control={<Radio />} label="1 - Average" />
            </RadioGroup>
          </FormSection>

          {/* Topic Suggestions */}
          <FormSection>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Topics/Areas that you would like to suggest for the next program?</Typography>
            <TextField fullWidth multiline rows={4} variant="outlined" name="topicSuggestions" value={formData.topicSuggestions} onChange={handleChange} />
          </FormSection>

          <Button type="submit" variant="contained" fullWidth sx={{ bgcolor: '#009688', color: 'white', '&:hover': { bgcolor: '#00796b' }, py: 1, borderRadius: 2 }}>
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
};

export default UserFeedbackForm;
