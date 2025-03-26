

// export default ManagerFeedbackForm;
import { useState, useEffect } from "react";
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
  Divider,Dialog, DialogActions, DialogContent, DialogTitle
} from "@mui/material";
import axios from "axios";
 
const StyledPaper = styled(Paper)({
  padding: "24px",
  maxWidth: 600,
  margin: "0 auto",
  marginTop: "32px",
  marginBottom: "32px",
  overflowY: "auto",
  maxHeight: "calc(100vh - 64px)",
  height: 600,
  scrollbarWidth: 'none', // For Firefox
  '&::-webkit-scrollbar': {
    display: 'none', // For Chrome, Safari, and Opera
  },
});

 
const FormSection = styled(Box)({
  marginBottom: "24px",
});
 
const ManagerFeedbackForm = () => {
  const [formData, setFormData] = useState({
    demonstrateSkill: "",
    skillDate: "",
    enhancementRating: "",
    suggestions: "",
    opportunityDate: "",
  });
 
  const [directName, setDirectName] = useState("");
  const [requestedBy, setRequestedBy] = useState("");
  const [courseName, setCourseName] = useState("");
 
  const [reqid, setReqid] = useState("");
  const [course_id, setCourseId] = useState("");
  const [employee_id, setEmployeeId] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    // Extract query parameters from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const reqidParam = urlParams.get("reqid");
    const courseIdParam = urlParams.get("course_id");
    const employeeIdParam = urlParams.get("employee_id");
 
    setReqid(reqidParam);
    setCourseId(courseIdParam);
    setEmployeeId(employeeIdParam);
 
    // Fetch data from the new backend API
    const fetchData = async () => {
      try {
        if (!reqidParam || !courseIdParam || !employeeIdParam) {
          console.error("Missing required query parameters: reqid, course_id, or employee_id.");
          alert("Invalid request. Missing required parameters.");
          return;
        }
 
        const response = await axios.get("http://localhost:8000/api/effectiveness-feedback/feedback/details", {
          params: { reqid: reqidParam, course_id: courseIdParam, employee_id: employeeIdParam },
        });
 
        const { username, course_name, requested_by } = response.data; // Adjusted to match the new API response
        setDirectName(username);
        setCourseName(course_name);
        setRequestedBy(requested_by);
      } catch (error) {
        console.error("Error fetching feedback details:", error);
 
        // Handle specific error codes
        if (error.response) {
          if (error.response.status === 500) {
            alert("Internal Server Error. Please try again later.");
          } else if (error.response.status === 404) {
            alert("Feedback details not found. Please check the parameters.");
          } else {
            alert(`Error: ${error.response.status} - ${error.response.data.message}`);
          }
        } else {
          alert("Failed to fetch feedback details. Please check your network connection.");
        }
      }
    };
 
    if (reqidParam && courseIdParam && employeeIdParam) {
      fetchData();
    }
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
 
    const requestData = {
      reqid,
      course_id,
      employee_id,
      demonstrate_skill: formData.demonstrateSkill,
      skill_date: formData.skillDate|| null, // Always include skillDate
      enhancement_rating: formData.enhancementRating || null, // Always include enhancementRating
      suggestions: formData.suggestions,
      opportunity_date: formData.opportunityDate || null, // Always include opportunityDate
    };
 
    try {
      const response = await axios.post(
        "http://localhost:8000/api/manager-feedback",
        requestData
      );
 
      if (response.status === 200) {
        console.log("Feedback submitted successfully:", response.data);
        // alert("Feedback submitted successfully!");
        setDialogOpen(true);
      } else {
        console.error("Failed to submit feedback:", response.statusText);
        alert("Failed to submit feedback.");
      }
    } catch (error) {
      console.error("Error while submitting feedback:", error);
      alert("Error while submitting feedback.");
    }
  };
  const handleDialogClose = () => {
    setDialogOpen(false);
    window.location.href = "https://harbingergroup.darwinbox.in/"; // Redirect to the specified URL
  };
  return (
    <Container sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", overflowY: "hidden" }}>
      <StyledPaper elevation={3}>
        <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: '700', mb: 2 ,color:"#4A9185",fontSize:"14px !important"}}>
          Skill Enhancement Feedback Form
        </Typography>
        <Divider />
        <form onSubmit={handleSubmit}>
          <FormSection>
            <Typography variant="subtitle2" sx={{ fontWeight: "600",mt:"1rem" ,fontSize:"12px !important" }}>
              Participant's Name
            </Typography>
            <Typography color='#4F4949'>{directName}</Typography>
          </FormSection>
 
          <FormSection>
            <Typography variant="subtitle2" sx={{ fontWeight: "600",fontSize:"12px !important" }}>
              Learning Requested By
            </Typography>
            <Typography color="#4F4949">{requestedBy}</Typography>
          </FormSection>
 
          <FormSection>
            <Typography variant="subtitle2" sx={{ fontWeight: "600",fontSize:"12px !important" }}>
              Course/Learning Name
            </Typography>
            <TextField fullWidth size="small" variant="outlined"   value={courseName} disabled sx={{ mt: 1 }}
           
            InputProps={{
              sx: {
                color: '#4F4949',
                fontSize: '12px !important',
                height:"30px !important",
              },
            }}
            />
          </FormSection>
 
          <FormSection>
            <Typography variant="subtitle2" sx={{ fontWeight: "600", mb: 1 }}>
              Has the learner been given an opportunity to demonstrate the skill?
            </Typography>
            <RadioGroup name="demonstrateSkill" value={formData.demonstrateSkill} onChange={handleChange} row>
              <FormControlLabel value="yes" sx={{color:"#4F4949", '& .MuiFormControlLabel-label': { fontSize: '12px !important'}}} control={<Radio size="6" color="" />} label="Yes" />
              <FormControlLabel value="no" sx={{color:"#4F4949", '& .MuiFormControlLabel-label': { fontSize: '12px !important'}}} control={<Radio size="6" color=""/>} label="No" />
            </RadioGroup>
          </FormSection>
 
          {/* Conditional rendering for Yes */}
          {formData.demonstrateSkill === "yes" && (
            <>
              <FormSection>
                <Typography variant="subtitle2" sx={{ fontWeight: "600",fontSize:"12px !important" }}>
                  If Yes, date from which it has been demonstrated?
                </Typography>
                <TextField
                  type="date"
                  fullWidth
                  variant="outlined"
                  name="skillDate"
                  value={formData.skillDate}
                  onChange={handleChange}
                  sx={{ mt: 1 ,width:"25%"}}
                  InputProps={{
                    sx: {
                      '& input': {
                        color: '#4F4949', // Change this to your desired color
                        fontSize: '13px ',
                      },
                    },
                  }}
                />
              </FormSection>
 
              <FormSection>
                <Typography variant="subtitle2" sx={{ fontWeight: "600",fontSize:"12px !important" }}>
                  Please rate the enhancement in the skill on a scale of 1 (Lowest) to 4 (Highest)
                </Typography>
                <FormControl fullWidth sx={{ mt: 1 }}>
                <TextField
      select
      name="enhancementRating"
      value={formData.enhancementRating}
      onChange={handleChange}
      placeholder="Enhancement Rating"
      variant="outlined"
      fullWidth
    >
 
     
      <MenuItem value="4">Very Good Enhancement</MenuItem>
      <MenuItem value="3">Good enhancement, Can work with NO or very minimal handholding</MenuItem>
      <MenuItem value="2">Some enhancement- Can work with handholding</MenuItem>
      <MenuItem value="1">No Enhancement</MenuItem>
    </TextField>
                </FormControl>
              </FormSection>
 
              <FormSection>
                <Typography variant="subtitle2" sx={{ fontWeight: "600",fontSize:"12px !important" }}>
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
                  InputProps={{
                    sx: {
                      color: '#4F4949',
                    },
                  }}
                />
              </FormSection>
            </>
          )}
 
          {/* Conditional rendering for No */}
          {formData.demonstrateSkill === "no" && (
            <>
              <FormSection>
                <Typography variant="subtitle2" sx={{ fontWeight: "600",fontSize:"12px !important" }}>
                  If No, By when will the opportunity arise?
                </Typography>
                <TextField
                  type="date"
                  fullWidth
                  variant="outlined"
                  name="opportunityDate"
                  value={formData.opportunityDate}
                  onChange={handleChange}
                  sx={{ mt: 1 ,width:"25%"}}
                  InputProps={{
                    sx: {
                      '& input': {
                        color: '#4F4949', // Change this to your desired color
                        fontSize: '13px ',
                      },
                    },
                  }}
                />
              </FormSection>
 
              <FormSection>
                <Typography variant="subtitle2" sx={{ fontWeight: "600",fontSize:"12px !important" }}>
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
                  InputProps={{
                    sx: {
                      color: '#4F4949',
                    },
                  }}
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
              fontSize: "12px ",
            }}
          >
            Submit Feedback
          </Button>
        </form>
        <Typography variant="caption" align="center" sx={{ display: "block", mt: 2, color: "gray" ,fontSize:"12px !important"}}>
          Copyright Â© 2025 Harbinger Groups.
        </Typography>
      </StyledPaper>
       {/* Dialog for feedback submission */}
       <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Feedback Submitted</DialogTitle>
        <DialogContent>
          <Typography>Thank you for your feedback!</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

ManagerFeedbackForm.propTypes = {
  directName: PropTypes.string,
  requestedBy: PropTypes.string,
  courseName: PropTypes.string,
};

export default ManagerFeedbackForm;
