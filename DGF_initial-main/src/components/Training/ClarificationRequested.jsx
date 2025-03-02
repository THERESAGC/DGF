 
import React from 'react';
import { Paper, Typography, Grid, Divider, Box, FormControl, TableCell, TableContainer, Table, TableHead, TableRow, TableBody, Avatar, Button, RadioGroup, FormControlLabel, Radio, TextField, Autocomplete, MenuItem, Select, TablePagination, Snackbar } from "@mui/material";
import { useState, useEffect ,useContext} from "react";
import { useParams, useNavigate } from "react-router-dom";
import IconButton from '@mui/material/IconButton'; // Correct import for IconButton
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CloseIcon from '@mui/icons-material/Close';
import './ClarificationRequested.css';
import AuthContext from "../Auth/AuthContext";
import formatDate from "../../utils/dateUtils";
import removeHtmlTags from "../../utils/htmlUtils";
import { arrayBufferToBase64 } from '../../utils/ImgConveter';
import { ChatContext } from '../context/ChatContext'; // Import ChatContext
import MuiAlert from '@mui/material/Alert';

// Define the Alert component for Snackbar
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
 
const ClarificationRequested = ({roleId}) => {
  const [learners, setLearners] = useState([]); // State to hold the fetched learners data
  const navigate = useNavigate();
  const { requestid } = useParams();
  const { user } = useContext(AuthContext); // Get the user from AuthContext
  const [requestDetails, setRequestDetails] = useState(null); // Store request details
   const { messages, sendMessage, newMessage, setNewMessage } = useContext(ChatContext);
   const [comments, setComments] = useState([]);
   const [userProfiles, setUserProfiles] = useState({}); // Store user profiles
   const [latestCommentId, setLatestCommentId] = useState(null); // State to store the latest comment ID
   const [searchResults, setSearchResults] = useState([]);
   const [selectedEmployee, setSelectedEmployee] = useState(null);
   const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [previousEmployeesInDB, setpreviousEmployeesInDB] = useState([]);
 
 
  const [formData, setFormData] = useState({
    emails: "",
    employees: [],
    invalidEmails: [],
    showTable: false,
    showSummary: false,
  })
 
 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
   
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestResponse = await fetch(`http://localhost:8000/api/training-request/${requestid}`);
        const requestdata = await requestResponse.json();
        setRequestDetails(requestdata);
        console.log('Request Details:', requestdata);
  
        const learnerResponse = await fetch(`http://localhost:8000/api/getEmpNewTrainingRequested/getEmpNewTrainingRequested?requestid=${requestid}`);
        const learnerdata = await learnerResponse.json();
        setpreviousEmployeesInDB(learnerdata);
  
        const updatedLearners = learnerdata.map((learner) => {
          if (learner.profile_image && learner.profile_image.data) {
            const base64Flag = `data:image/jpeg;base64,${arrayBufferToBase64(learner.profile_image.data)}`;
            return { ...learner, profile_image: base64Flag, availableFrom: learner.availablefrom, bandwidth: learner.dailyband, weekend: learner.availableonweekend };
          }
          return learner;
        });
  
        console.log("Learners data:", updatedLearners);  // Check if learners are fetched
  
        setLearners(updatedLearners);
  
        const commentsResponse = await fetch(`http://localhost:8000/api/comments/${requestid}`);
        const commentsdata = await commentsResponse.json();
        setComments(commentsdata);
        console.log('Fetched Comments:', commentsdata); // Add this line to log fetched comments
  
        if (commentsdata.length > 0) {
          const latestComment = commentsdata.reduce((latest, comment) =>
            new Date(comment.created_date) > new Date(latest.created_date) ? comment : latest
          );
          setLatestCommentId(latestComment.comment_id);
        }
  
        const userIds = new Set();
        commentsdata.forEach(comment => {
          if (comment.created_by) userIds.add(comment.created_by);
        });
  
        const profiles = {};
        for (let userId of userIds) {
          const userResponse = await fetch(`http://localhost:8000/api/getempdetails/getEmpbasedOnId/${userId}`);
          const userData = await userResponse.json();
          console.log(`User Data for ${userId}:`, userData);
          if (userData && userData.length > 0) {
            if (userData[0]?.profile_image?.data) {
              const base64Image = `data:image/jpeg;base64,${arrayBufferToBase64(userData[0].profile_image.data)}`;
              userData[0].profile_image = base64Image;
            }
            profiles[userId] = userData[0];
          } else {
            profiles[userId] = { emp_name: 'Unknown', profile_image: '/default-avatar.png' };
          }
        }
        setUserProfiles(profiles);
  
        // Update formData with learners
        setFormData((prevFormData) => ({
          ...prevFormData,
          employees: updatedLearners,
          showTable: true,
        }));
  
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [requestid]);
 
const sortedComments = comments.sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
 
useEffect(() => {
  const updatedLearners = learners.map(learner => {
    if (learner.profile_image && learner.profile_image.data) {
      const base64Flag = `data:image/jpeg;base64,${arrayBufferToBase64(learner.profile_image.data)}`;
      if (learner.profile_image !== base64Flag) {
        return { ...learner, profile_image: base64Flag };
      }
    }
    return learner;
  });
  setLearners(updatedLearners);
}, [learners.length]);
 
useEffect(() => {
  if (requestid) {
    fetch(`http://localhost:8000/api/training-request/${requestid}`)
      .then(response => response.json())
      .then(data => setRequestDetails(data))
      .catch(error => console.error('Error fetching data:', error));
  }
}, [requestid]);
 
useEffect(() => {
  console.log("Form Data Updated: ", formData); // Debugging formData state
}, [formData]);
 
 
const addEmployee = async () => {
  // Debugging: Check if selectedEmployee is valid
  console.log("Selected Employee: ", selectedEmployee);
 
  const newEmployees = [];
  const invalidEmails = [];
 
  // Process selected employee from the dropdown
  if (selectedEmployee && !formData.employees.some((emp) => emp.id === selectedEmployee.id)) {
    newEmployees.push({
      ...selectedEmployee,
      emp_id: selectedEmployee.id,  // Add the emp_id field
      emp_name: selectedEmployee.name,  // Add the emp_name field
      availableFrom: "",
      bandwidth: "",
      weekend: "",
    });
    console.log("New employee added: ", newEmployees); // Debugging
    setSelectedEmployee(null); // Clear selected employee after adding
  }
 
  // Process comma-separated emails and add corresponding employees
  if (formData.emails.trim() !== "") {
    const emailList = formData.emails.split(",").map((email) => email.trim());
    const uniqueEmails = [...new Set(emailList)]; // Remove duplicate emails
 
    for (const email of uniqueEmails) {
      const employee = await handleEmailSearch(email);
      if (employee) {
        if (!formData.employees.some((emp) => emp.emp_id === employee.id)) {
          newEmployees.push({
            ...employee,
            emp_id: employee.id, // Add emp_id if it doesn't exist
            emp_name: employee.name, // Add emp_name if it doesn't exist
          });
        }
      } else {
        invalidEmails.push(email);
      }
    }
 
    if (invalidEmails.length > 0) {
      setSnackbarMessage(`Invalid emails: ${invalidEmails.join(", ")}`);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  }
 
  // Update formData with new employees
  setFormData((prevFormData) => ({
    ...prevFormData,
    employees: [...prevFormData.employees, ...newEmployees],
    showTable: true, // Ensure table is shown when employees are added
    showSummary: true,
    emails: "", // Clear the email input field after adding
    invalidEmails: invalidEmails, // Store invalid emails
  }));
};
 
const updateEmployee = (emp_id, field, value) => {
  setFormData((prevData) => {
    const updatedEmployees = prevData.employees.map((emp) => {
      if (emp.emp_id === emp_id) {
        return { ...emp, [field]: value };
      }
      return emp;
    });
    return { ...prevData, employees: updatedEmployees };
  });
};
const deleteEmployeeinDB = async (emp_id) => {
  const requestBody = {
    empId: emp_id,
    requestId: requestDetails.requestid
  };
  console.log(emp_id, requestDetails.requestid);
  const response = await fetch('http://localhost:8000/api/empDeleteTrainingRequested/deleteEmployeeFromTrainingRequest', {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });
  if (response.ok) {
    console.log(`Employee ${emp_id} deleted successfully.`);
  } else {
    console.error("Failed to delete employee.");
  }
};

const removeEmployee = (emp_id) => {
  deleteEmployeeinDB(emp_id); // Call the function to delete the employee from the database
  setFormData((prevData) => {
    const updatedEmployees = prevData.employees.filter((emp) => emp.emp_id !== emp_id);
    return { ...prevData, employees: updatedEmployees };
  });
};
 
 
const handleEmailSearch = async (email) => {
  try {
   
    const response = await fetch(
      `http://localhost:8000/api/employee/searchEmployeesByManagerIdAndEmail?managerid=${requestDetails.requestedbyid}&emailPrefix=${email}`
    );
    const data = await response.json();
 
    if (response.ok && data.length > 0) {
      const employee = data[0];
      if (
        !formData.employees.some(
          (existingEmp) => existingEmp.id === employee.emp_id
        )
      ) {
        return {
          id: employee.emp_id,
          name: employee.emp_name,
          email: employee.emp_email,
          availableFrom: "",
          bandwidth: "",
          weekend: "",
          profileImage: `data:image/jpeg;base64,${arrayBufferToBase64(employee.profile_image.data)}`, // Convert image data to base64
          uniqueKey: `${employee.emp_id}-${Date.now()}`, // Add unique key
        };
      }
    } else {
      console.error("Failed to fetch employee by email:", data.message);
      setSnackbarMessage(`Email ${email} not found.`);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  } catch (error) {
    console.error("Error fetching employee by email:", error);
    setSnackbarMessage(`Error fetching employee by email: ${error.message}`);
    setSnackbarSeverity("error");
    setSnackbarOpen(true);
  }
  return null;
};
const handleEmployeeSearch = (event, value) => {
  if (value.length > 0) {
    const apiUrl = `http://localhost:8000/api/employeeSearchByName/searchEmployeesByName?managerId=${requestDetails.requestedbyid}&name=${value}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSearchResults(
            data.map((emp) => ({
              id: emp.emp_id,
              name: emp.emp_name,
              email: emp.emp_email,
              profileImage: `data:image/jpeg;base64,${arrayBufferToBase64(emp.profile_image.data)}`, // Convert image data to base64
              uniqueKey: `${emp.emp_id}-${Date.now()}`, // Add unique key
            }))
          );
        } else {
          console.error(
            "Unexpected response format for employee search by name:",
            data
          );
        }
      })
      .catch((error) =>
        console.error("Error fetching employees by name:", error)
      );
  }
};
 
const addEmployeeinDB = async (employee) => {
  const requestBody = [{
    emp_id: employee.emp_id,
    availablefrom: employee.availableFrom.split("T")[0], // Format date to YYYY-MM-DD
    dailyband: employee.bandwidth,
    availableonweekend: employee.weekend === 1,
    requestid: requestDetails.requestid,
  }];
  console.log("Add", requestBody);
  const response = await fetch("http://localhost:8000/api/empNewTrainingRequested/insertTrainingRequest", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });
  if (response.ok) {
    console.log(`Employee ${employee.emp_id} added successfully.`);
  } else {
    console.error("Failed to add employee.");
    const errorData = await response.json();
    console.error("Error details:", errorData);
  }
};

const updateEmployeeinDB = async (employee) => {
  const requestBody = [{
    emp_id: employee.emp_id,
    requestid: requestDetails.requestid,
    availablefrom: employee.availableFrom.split("T")[0], // Format date to YYYY-MM-DD
    dailyband: employee.bandwidth,
    availableonweekend: employee.weekend === 1,
  }];
  console.log("Update", requestBody);
  const response = await fetch("http://localhost:8000/api/empUpdateTrainingRequested/updateMultipleTrainingRequests", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });
  if (response.ok) {
    console.log(`Employee ${employee.emp_id} updated successfully.`);
  } else {
    console.error("Failed to update employee.");
    const errorData = await response.json();
    console.error("Error details:", errorData);
  }
};

const handleSubmit = async () => {
  /**********************Comments Websocket logic***********************/
  if (newMessage.trim()) {
    sendMessage(newMessage, requestDetails?.requestid, user.emp_id, "Approval Requested");
  }

  const commentdata = {
    requestid: requestDetails?.requestid,
    comment_text: newMessage,
    created_by: user.emp_id,
    parent_comment_id: latestCommentId,
    requeststatus: "Approval Requested"
  };

  if (latestCommentId) {
    try {
      const response = await fetch("http://localhost:8000/api/comments/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentdata),
      });

      if (response.ok) {
        console.log("Comment Added Successfully");
        setNewMessage('');
      } else {
        console.error("Error adding comment:", await response.json());
      }
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  }

  /*************Employee addition removal logic********** */

  try {
    const currentEmployeeIds = formData.employees.map((emp) => emp.emp_id);

    // 1. Detect new employees
    const newEmployees = formData.employees.filter(
      (emp) => !previousEmployeesInDB.some((dbEmp) => dbEmp.emp_id === emp.emp_id)
    );

    // 2. Detect employees that need updating
    const employeesToUpdate = formData.employees.filter(
      (emp) =>
        previousEmployeesInDB.some(
          (dbEmp) => dbEmp.emp_id === emp.emp_id && hasChanges(emp, dbEmp)
        )
    );

    // 3. Detect removed employees
    const employeesToDelete = previousEmployeesInDB.filter(
      (dbEmp) => !currentEmployeeIds.includes(dbEmp.emp_id)
    );

    // Perform API calls to add, update, or delete employees
    await Promise.all([
      ...newEmployees.map((emp) => addEmployeeinDB(emp)),
      ...employeesToUpdate.map((emp) => updateEmployeeinDB(emp)),
      ...employeesToDelete.map((emp) => deleteEmployeeinDB(emp.emp_id)),
    ]);

    // After successful operation, show success message
    setSnackbarMessage("Employee records updated successfully");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);

    // Optionally reset form state or clear formData
    setFormData({
      employees: [],
      showTable: false,
      showSummary: false,
      emails: "",
      invalidEmails: [],
    });

    
    // // Restart the page
    // setTimeout(() => {
    //   window.location.reload();
    // }); // Adjust the delay as needed


  } catch (error) {
    console.error("Error submitting employee data:", error);
    setSnackbarMessage("An error occurred while updating employee records.");
    setSnackbarSeverity("error");
    setSnackbarOpen(true);
  }
};
 
// Helper function to check if there are changes between form data and database data
const hasChanges = (employee, dbEmployee) => {
  return (
    employee.availableFrom !== dbEmployee.availableFrom ||
    employee.bandwidth !== dbEmployee.bandwidth ||
    employee.weekend !== dbEmployee.weekend
  );
 
};
  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center">
      <Box
  display="flex"
  style={{
   
    borderRadius: "10px",
    alignItems: "center",
 
  }}
>
  <IconButton style={{ color: "black", marginRight: "1rem"  , marginBottom: "-1rem",}}>
    <ArrowBackIosNewIcon />
  </IconButton></Box  ><Box style={{marginLeft: "-34rem"}}>  
  <Typography
    variant="h5"
    gutterBottom
    className="mainHeading"
    style={{ fontWeight: "600", fontSize: "14px"}}
  >
    Learning Request
  </Typography>
</Box>
      </Box>
      <Divider
        style={{ margin: "1rem 0 ", marginLeft: "-30px", marginRight: "-40px" }}
      />
      <Paper elevation={1} className="paper" style={{ height: "100%", width: "100%",marginLeft:"-1.5rem" }}>
        <div className="inner-container">
          <Box style={{ padding: "10px", marginTop: "1rem" }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className="form-control" style={{ marginBottom: "1rem" }}>
                  <Typography className="typography-label-upper">Request ID/No:</Typography>
                  <Typography className="typography-value-upper"> #{requestDetails?.requestid}</Typography>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className="form-control">
                  <Typography className="typography-label-upper">Request By:</Typography>
                  <Typography className="typography-value-upper"> {requestDetails?.requestedby}</Typography>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className="form-control">
                  <Typography className="typography-label-upper">Project:</Typography>
                  <Typography className="typography-value-upper"> {requestDetails?.newprospectname || requestDetails?.project} </Typography>
                </FormControl>
              </Grid>
            </Grid>
 
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className="form-control">
                  <Typography className="typography-label-upper">Service Division:</Typography>
                  <Typography className="typography-value-upper">{requestDetails?.service_division}</Typography>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className="form-control">
                  <Typography className="typography-label-upper">Expected Completion:</Typography>
                  <Typography className="typography-value-upper"> {formatDate(requestDetails?.expecteddeadline)  }  </Typography>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className="form-control">
                  <Typography className="typography-label-upper">Techstack / Area:</Typography>
                  <Typography className="typography-value-upper">Front-end</Typography>
                </FormControl>
              </Grid>
            </Grid>
 
            <Grid container spacing={2} style={{ marginTop: "0.5rem" }}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className="form-control">
                  <Typography className="typography-label-upper">Primary Skills / Competencies:</Typography>
                  <Typography className="typography-value-upper"> {requestDetails?.primarySkills && requestDetails?.primarySkills.length > 0 ? (
        <ul style={{ paddingLeft: '20px' }}>
          {requestDetails?.primarySkills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      ) : (
        <Typography className="typography-value-upper">No skills available</Typography>
      )}</Typography>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
 
          <Divider className="divider" style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }} />
          <Box>
            <Grid container spacing={2} style={{ marginTop: "0.5rem",paddingLeft: "5px" }}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className="form-control">
                  <Typography className="typography-label-upper">Other Skill Information in Details:</Typography>
                  <Typography className="typography-value-upper"> { removeHtmlTags(requestDetails?.otherskill)}</Typography>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className="form-control">
                  <Typography className="typography-label-upper">Completion Criteria:</Typography>
                  <Typography className="typography-value-upper">
                  {removeHtmlTags(requestDetails?.suggestedcompletioncriteria)}
                  </Typography>
                </FormControl>
              </Grid>
            </Grid>
 
            <Grid container spacing={2} style={{ paddingLeft: "5px",marginTop: "0.5rem",}}>
              <Grid item xs={12}>
                <FormControl fullWidth className="form-control">
                  <Typography className="typography-label-upper">Comments:</Typography>
                  <Typography className="typography-value-upper"  >
                  {removeHtmlTags(requestDetails?.comments)}</Typography>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
 
          <Divider className="divider" style={{ marginTop: "1rem", marginBottom: "1rem" }} />
          <Box>
            <div style={{ maxWidth: "100%", margin: "auto",paddingLeft: "0.5rem" }}>
<h5>Employee Details</h5>
<Typography className="typography-label-upper">Employee with upto 3 ongoing learnings cannot
   be included in this learning request
</Typography>
<Grid container spacing={5} >
  {/* Select Employee Section */}
  <Grid item size={3.5}>
    <FormControl fullWidth>
      <Typography className="subheader" style={{ display: "inline", marginBottom: "0.5rem", color: "#4F4949", marginTop: "25px" }}>
        Select Employee <span className="required">*</span>
      </Typography>
      <Autocomplete
        style={{ width: "250px", display: "inline", marginLeft: "0.5rem" }}
        options={searchResults}
        getOptionLabel={(option) => option.name || ""}
        onInputChange={handleEmployeeSearch}
        onChange={(event, value) => setSelectedEmployee(value)}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            placeholder="Search Employees"
            style={{ fontSize: "12px" }}
            InputProps={{
              ...params.InputProps,
              style: { fontSize: "12.5px" },
            }}
            InputLabelProps={{
              style: { fontSize: "12px", opacity: "0.75" },
            }}
          />
        )}
        PaperComponent={(props) => (
          <Paper {...props} style={{ maxHeight: 300, width: 250, fontSize: "12px" }} />
        )}
        renderOption={(props, option) => (
          <li {...props} style={{ fontSize: "12px", padding: "4px 6px", display: "flex", alignItems: "center" }}>
            <Avatar src={option.profileImage} alt={option.name} style={{ marginRight: "8px" }} />
            {option.name}
          </li>
        )}
      />
    </FormControl>
  </Grid>

  {/* OR Section */}
  <Grid item size={1} style={{ marginTop: "52px",marginLeft: "-30px" }}>
    <Typography className="subheader" align="center" style={{ display: "inline", marginTop: "32px", color: "#4F4949", fontSize: "12px" }}>
      OR
    </Typography>
  </Grid>

  {/* Email Input Section */}
  <Grid item size={3.5} >
    <FormControl fullWidth style={{ marginLeft: "-36px", marginTop: "24px" }}>
      <Typography className="subheader" style={{ display: "inline", marginBottom: "0.5rem", color: "#4F4949",  width: "280px" }}>
        Enter comma(,) separated email ids{" "}
        <span className="required">*</span>
      </Typography>
      <TextField
        variant="outlined"
        name="emails"
        placeholder="Enter Email by , separated"
        value={formData.emails}
        onChange={handleChange}
        InputProps={{
          style: { fontSize: "12.5px", marginLeft: "0px" },
        }}
      />
    </FormControl>
  </Grid>

  {/* Add Employee Button */}
  <Grid item size={4}>
    <Box display="flex" justifyContent="flex-end" marginTop="1.7rem" style={{ marginLeft: "-56px", marginTop: "50px" }}>
      <Button
        className="btn"
        variant="contained"
        onClick={addEmployee}
        sx={{
          height: "31px",
          fontSize: "21px",
          fontWeight: "500",
          minWidth: "40px",
          backgroundColor: "white",
          color: "#1C71FE",
          boxShadow: "none",
          border: "0.5px solid #1C71FE",
          marginLeft: "10px",
        }}
      >
        +
      </Button>
    </Box>
  </Grid>
</Grid>
  {/* {console.log(formData.employees.length) } */}
  {formData.showTable && formData.employees.length > 0 ? (
  <Grid item size={12}>
    <TableContainer component={Paper} className="tableContainer">
      <Table size="small">
        <TableHead className="head">
          <TableRow style={{ height: "10px", backgroundColor: '#CCE3FF' }}>
            <TableCell className="tableHeader">Employee ID</TableCell>
            <TableCell className="tableHeader">Name</TableCell>
            <TableCell className="tableHeader">Available From</TableCell>
            <TableCell className="tableHeader">Daily Bandwidth</TableCell>
            <TableCell className="tableHeader">Available on Weekend?</TableCell>
            <TableCell className="tableHeader">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {formData.employees.map((employee) => (
            <TableRow key={employee.emp_id}>
              <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                  <Avatar src={employee.profile_image || employee.profileImage} />
                  {employee.emp_id}
                </Box>
              </TableCell>
              <TableCell>{employee.emp_name}</TableCell>
              <TableCell>
                <TextField
                  type="date"
                  value={employee.availableFrom ? employee.availableFrom.split("T")[0] : ""}
                  onChange={(e) => updateEmployee(employee.emp_id, "availableFrom", e.target.value)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Select
                  value={employee.bandwidth || ""}
                  onChange={(e) => updateEmployee(employee.emp_id, "bandwidth", e.target.value)}
                  size="small"
                >
                  <MenuItem value="">Select</MenuItem>
                  <MenuItem value="2 Hours">2 Hours</MenuItem>
                  <MenuItem value="4 Hours">4 Hours</MenuItem>
                  <MenuItem value="6 Hours">6 Hours</MenuItem>
                  <MenuItem value="Full Day">Full Day</MenuItem>
                </Select>
              </TableCell>
              <TableCell>
              <RadioGroup
  row
  value={employee.weekend === 1 ? "Yes" : "No"}
  onChange={(e) => updateEmployee(employee.emp_id, "weekend", e.target.value === "Yes" ? 1 : 0)}
>
  <FormControlLabel value="Yes" control={<Radio size="small" />} label="Yes" />
  <FormControlLabel value="No" control={<Radio size="small" />} label="No" />
</RadioGroup>
              </TableCell>
              <TableCell>
                <IconButton color="error" onClick={() => removeEmployee(employee.emp_id)} size="small">
                  <CloseIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Grid>
) : (
  <p>No employees available</p>
)}
 
 
<Box  style={{
    backgroundColor: "#F8FBFF",
    padding: "16px",
    borderRadius: "8px",
    marginTop: "1rem",
    marginBottom: "1rem",}}>
 
             
              <Box
  style={{
    backgroundColor: "#F8FBFF",
    padding: "16px",
    borderRadius: "8px",
    marginTop: "1rem",
    marginBottom: "1rem",
    maxHeight: sortedComments.length > 0 ?  window.innerHeight * 0.3: "none", // Set maxHeight if there are comments
    overflowY: sortedComments.length > 0 ? "auto" : "visible", // Enable scroll if there are comments
  }}
>
  <Box display="flex" flexDirection="column" gap={2} paddingLeft={5}>
    {sortedComments.length > 0 ? (
      sortedComments.map((comment) => {
        return (
          <div key={comment.comment_id} className="user-profile" style={{ marginBottom: '16px' }}>
            <div className="avatar-name" style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              {/* Display Avatar for created_by */}
              <Avatar
                alt="User"
                src={userProfiles[comment.created_by]?.profile_image || '/default-avatar.png'}
                style={{ marginRight: '8px' }}
              />
              {/* Display User Name for created_by */}
              <Typography className="typography-value-upper">
                {userProfiles[comment.created_by]?.emp_name || 'Unknown'}
              </Typography>
            </div>
            {/* Display Comment Text */}
            <Typography className="typography-value-upper" style={{ marginBottom: '8px' }}>
              {comment.comment_text}
            </Typography>
            {/* Display the Created Date */}
            <Typography className="typography-label-upper" style={{ fontSize: '0.85rem' }}>
              {formatDate(comment.created_date)}
            </Typography>
          </div>
        );
      })
    ) : (
      <Typography></Typography>
    )}
  </Box>
 
</Box>
<Box  paddingLeft={5}>
    <FormControl fullWidth style={{ marginBottom: "1rem" }}>
      <Typography style={{ fontSize: "12px", marginTop: "0.5rem", color: "#4F4949" }}>
         Your Comments
      </Typography>
      <TextField
        multiline
        rows={4} // Ensure this is set to 4 rows
        fullWidth
        variant="outlined"
        margin="normal"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        InputProps={{
          style: { fontSize: '12px', backgroundColor: '#ffffff', padding: '10px', minHeight: '100px' }, // Set minimum height
        }}
      />
    </FormControl>
  </Box>
  </Box>
              <Box
                display="flex"
                justifyContent="flex-end"
                style={{ marginTop: "4rem" }}
                gap={2}
              >
                <Button
                  variant="outlined"
                  style={{ minWidth: "12px", textTransform: 'none', color: '#1C71FE', boxShadow: 'none', border: 'none', }}
                  onClick={() => navigate("/training-container")} // Add this line
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  style={{ minWidth: "120px", textTransform: 'none', borderRadius: '10px ', backgroundColor: '#066DD2', boxShadow: 'none', color: 'white' }}
                 onClick={handleSubmit}
                >
                  Submit
                </Button>
              </Box>
            </div>
          </Box>
        </div>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};
 
export default ClarificationRequested;
 
 