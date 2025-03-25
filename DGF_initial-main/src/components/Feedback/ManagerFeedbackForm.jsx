// import { useState } from "react";
// import PropTypes from "prop-types";
// import {
//   Box,
//   Container,
//   Typography,
//   TextField,
//   Paper,
//   Button,
//   FormControlLabel,
//   Radio,
//   RadioGroup,
//   MenuItem,
//   Select,
//   InputLabel,
//   FormControl,
//   styled,
// } from "@mui/material";

// const StyledPaper = styled(Paper)({
//   padding: "24px",
//   maxWidth: 600,
//   margin: "0 auto",
//   marginTop: "32px",
//   marginBottom: "32px",
//   overflowY: "auto", // Enable scrolling within the paper
//   maxHeight: "calc(100vh - 64px)", // Adjust height to fit within the viewport
//   height: 600, // Set a fixed height for the paper container
// });

// const FormSection = styled(Box)({
//   marginBottom: "24px",
// });

// const ManagerFeedbackForm = ({
//   directName = "Radhika Pathak",
//   requestedBy = "Smruti Adyalkar",
//   courseName = "Rebuild Your Basics- Project Management Blueprint",
// }) => {
//   const [formData, setFormData] = useState({
//     demonstrateSkill: "",
//     skillDate: "",
//     enhancementRating: "",
//     suggestions: "",
//     opportunityDate: "",
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
//     console.log("Form submitted:", formData);
//     // Add your form submission logic here
//   };

//   return (
//     <Container sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", overflowY: "auto" }}>
//       <StyledPaper elevation={3}>
//         <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: "bold", mb: 2 }}>
//           Skill Enhancement Feedback Form
//         </Typography>

//         <form onSubmit={handleSubmit}>
//           <FormSection>
//             <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
//               Participant's Name
//             </Typography>
//             <Typography>{directName}</Typography>
//           </FormSection>

//           <FormSection>
//             <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
//               Learning Requested By
//             </Typography>
//             <Typography>{requestedBy}</Typography>
//           </FormSection>

//           <FormSection>
//             <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
//               Course/Learning Name
//             </Typography>
//             <TextField fullWidth size="small" variant="outlined" value={courseName} disabled sx={{ mt: 1 }} />
//           </FormSection>

//           <FormSection>
//             <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
//               Has the learner been given an opportunity to demonstrate the skill?
//             </Typography>
//             <RadioGroup name="demonstrateSkill" value={formData.demonstrateSkill} onChange={handleChange} row>
//               <FormControlLabel value="yes" control={<Radio />} label="Yes" />
//               <FormControlLabel value="no" control={<Radio />} label="No" />
//             </RadioGroup>
//           </FormSection>

//           {/* Conditional rendering for Yes */}
//           {formData.demonstrateSkill === "yes" && (
//             <>
//               <FormSection>
//                 <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
//                   If Yes, date from which it has been demonstrated?
//                 </Typography>
//                 <TextField
//                   type="date"
//                   fullWidth
//                   variant="outlined"
//                   name="skillDate"
//                   value={formData.skillDate}
//                   onChange={handleChange}
//                   sx={{ mt: 1 }}
//                 />
//               </FormSection>

//               <FormSection>
//                 <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
//                   Please rate the enhancement in the skill on a scale of 1 (Lowest) to 4 (Highest)
//                 </Typography>
//                 <FormControl fullWidth sx={{ mt: 1 }}>
//                   <InputLabel>Enhancement Rating</InputLabel>
//                   <Select
//                     name="enhancementRating"
//                     value={formData.enhancementRating}
//                     onChange={handleChange}
//                     label="Enhancement Rating"
//                   >
//                     <MenuItem value="4">Very Good Enhancement</MenuItem>
//                     <MenuItem value="3">Good enhancement, Can work with NO or very minimal handholding</MenuItem>
//                     <MenuItem value="2">Some enhancement- Can work with handholding</MenuItem>
//                     <MenuItem value="1">No Enhancement</MenuItem>
//                   </Select>
//                 </FormControl>
//               </FormSection>

//               <FormSection>
//                 <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
//                   Any other suggestions/Comments/Recommendations for the next skill to be initiated
//                 </Typography>
//                 <TextField
//                   fullWidth
//                   helperText="Please provide your suggestions here"
//                   rows={4}
//                   variant="outlined"
//                   name="suggestions"
//                   value={formData.suggestions}
//                   onChange={handleChange}
//                 />
//               </FormSection>
//             </>
//           )}

//           {/* Conditional rendering for No */}
//           {formData.demonstrateSkill === "no" && (
//             <>
//               <FormSection>
//                 <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
//                   If No, By when will the opportunity arise?
//                 </Typography>
//                 <TextField
//                   type="date"
//                   fullWidth
//                   variant="outlined"
//                   name="opportunityDate"
//                   value={formData.opportunityDate}
//                   onChange={handleChange}
//                   sx={{ mt: 1 }}
//                 />
//               </FormSection>

//               <FormSection>
//                 <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
//                   Any other suggestions/Comments/Recommendations for the next skill to be initiated
//                 </Typography>
//                 <TextField
//                   fullWidth
//                   helperText="Please provide your suggestions here"
//                   rows={4}
//                   variant="outlined"
//                   name="suggestions"
//                   value={formData.suggestions}
//                   onChange={handleChange}
//                 />
//               </FormSection>
//             </>
//           )}

//           <Button
//             type="submit"
//             variant="contained"
//             fullWidth
//             sx={{
//               bgcolor: "#009688",
//               color: "white",
//               "&:hover": {
//                 bgcolor: "#00796b",
//               },
//               py: 1,
//               borderRadius: 2,
//             }}
//           >
//             Submit Feedback
//           </Button>
//         </form>
//         <Typography variant="caption" align="center" sx={{ display: "block", mt: 2, color: "gray" }}>
//           Copyright Â© 2025 Harbinger Groups.
//         </Typography>
//       </StyledPaper>
//     </Container>
//   );
// };

// ManagerFeedbackForm.propTypes = {
//   directName: PropTypes.string,
//   requestedBy: PropTypes.string,
//   courseName: PropTypes.string,
// };

// export default ManagerFeedbackForm;
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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
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
  height: 600, // Set a fixed height for the paper container
});

const FormSection = styled(Box)({
  marginBottom: "24px",
});

const ManagerFeedbackForm = ({
  directName = "Radhika Pathak",
  requestedBy = "Smruti Adyalkar",
  courseName = "Rebuild Your Basics- Project Management Blueprint",
}) => {
  const [formData, setFormData] = useState({
    demonstrateSkill: "",
    skillDate: "",
    enhancementRating: "",
    suggestions: "",
    opportunityDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the data to send
    const requestData = {
      reqid: "REQ12345", // Static value
      course_id: "CSE101", // Static value
      employee_id: "EMP001", // Static value
      demonstrate_skill: formData.demonstrateSkill,
      skill_date: formData.skillDate,
      enhancement_rating: formData.enhancementRating,
      suggestions: formData.suggestions,
      opportunity_date: formData.opportunityDate || null, // Set null if not available
    };

    try {
      const response = await fetch("http://localhost:8000/api/manager-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Feedback submitted successfully:", result);
        alert("Feedback submitted successfully");
      } else {
        console.error("Failed to submit feedback", response.statusText);
        alert("Failed to submit feedback");
      }
    } catch (error) {
      console.error("Error while submitting feedback:", error);
      alert("Error while submitting feedback");
    }
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
              Participant's Name
            </Typography>
            <Typography>{directName}</Typography>
          </FormSection>

          <FormSection>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
              Learning Requested By
            </Typography>
            <Typography>{requestedBy}</Typography>
          </FormSection>

          <FormSection>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
              Course/Learning Name
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

          {/* Conditional rendering for Yes */}
          {formData.demonstrateSkill === "yes" && (
            <>
              <FormSection>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  If Yes, date from which it has been demonstrated?
                </Typography>
                <TextField
                  type="date"
                  fullWidth
                  variant="outlined"
                  name="skillDate"
                  value={formData.skillDate}
                  onChange={handleChange}
                  sx={{ mt: 1 }}
                />
              </FormSection>

              <FormSection>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Please rate the enhancement in the skill on a scale of 1 (Lowest) to 4 (Highest)
                </Typography>
                <FormControl fullWidth sx={{ mt: 1 }}>
                  <InputLabel>Enhancement Rating</InputLabel>
                  <Select
                    name="enhancementRating"
                    value={formData.enhancementRating}
                    onChange={handleChange}
                    label="Enhancement Rating"
                  >
                    <MenuItem value="4">Very Good Enhancement</MenuItem>
                    <MenuItem value="3">Good enhancement, Can work with NO or very minimal handholding</MenuItem>
                    <MenuItem value="2">Some enhancement- Can work with handholding</MenuItem>
                    <MenuItem value="1">No Enhancement</MenuItem>
                  </Select>
                </FormControl>
              </FormSection>

              <FormSection>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
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
            </>
          )}

          {/* Conditional rendering for No */}
          {formData.demonstrateSkill === "no" && (
            <>
              <FormSection>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  If No, By when will the opportunity arise?
                </Typography>
                <TextField
                  type="date"
                  fullWidth
                  variant="outlined"
                  name="opportunityDate"
                  value={formData.opportunityDate}
                  onChange={handleChange}
                  sx={{ mt: 1 }}
                />
              </FormSection>

              <FormSection>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
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
            </>
          )}

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
