import { useState, useEffect, useContext } from "react";
import {
 Paper, Typography, Select, MenuItem, FormControl, RadioGroup,
  TextField, FormControlLabel, Radio, Button,
  Box, Divider, TableCell, TableContainer, TableBody, TableHead, TableRow, Table, IconButton,
  Avatar, Autocomplete,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CloseIcon from "@mui/icons-material/Close";
import TablePagination from "@mui/material/TablePagination";
import ReactQuill from 'react-quill-new'; // Import react-quill-new
import 'react-quill-new/dist/quill.snow.css'; // Import styles for react-quill-new
import './NewTrainingRequest.css'; // Import the CSS file
import AuthContext from "../Auth/AuthContext";
import { Snackbar, Alert } from "@mui/material";

const CustomRadio = styled(Radio)({
  "& .MuiSvgIcon-root": { fontSize: 16 },
});

const NewTrainingRequest = () => {
  const { user } = useContext(AuthContext); // Get the user from AuthContext
  const [formData, setFormData] = useState({
    completionCriteria: "",
    otherSkill: "",
    comment: "",
    trainingPurpose: "prospect",
    employeeDetails: "add",
    selectedDate: null,
    emails: "",
    employees: [],
    invalidEmails: [],
    showSummary: false,
    rowsPerPage: 5,
    page: 0,
    showTable: false,
    sources: [],
    trainingObjectives: [],
    selectedSource: "",
    selectedTrainingObjective: "",
    techStacks: [],
    selectedTechStack: "",
    primarySkills: [],
    selectedPrimarySkill: "",
    projects: [],
    selectedProject: "",
    employeeLevels: [],
    selectedEmployeeLevel: [],
    services: [],
    requestonbehalf: "",
    prospectName: "",
    numberOfPeople: "",
    selectedServiceDivision: "",
  });
  const toPascalCase = (text) => {
    return text.replace(/\w+/g, (word) => word[0].toUpperCase() + word.slice(1).toLowerCase());
  };

  const [searchResults, setSearchResults] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [newRequestId, setNewRequestId] = useState(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:8000/api/role/sources?role_id=${user.role_id}`)
        .then(response => response.json())
        .then(data => {
          setFormData(prevFormData => ({
            ...prevFormData,
            sources: data,
          }));
        })
        .catch(error => console.error('Error fetching sources:', error));
    }
    // Fetch tech stacks
    fetch(`http://localhost:8000/api/techstack/all`)
      .then(response => response.json())
      .then(data => {
        setFormData(prevFormData => ({
          ...prevFormData,
          techStacks: data,
        }));
      })
      .catch(error => console.error('Error fetching tech stacks:', error));
  }, [user]);
 
  useEffect(() => {
    // Fetch services data
    fetch(`http://localhost:8000/api/services`)
      .then(response => response.json())
      .then(data => {
        setFormData(prevFormData => ({
          ...prevFormData,
          services: data.services,
        }));
      })
      .catch(error => console.error('Error fetching services:', error));
  }, []);
 
  useEffect(() => {
    // Fetch employee levels data
    fetch(`http://localhost:8000/api/employee-level/all`)
      .then(response => response.json())
      .then(data => {
        setFormData(prevFormData => ({
          ...prevFormData,
          employeeLevels: data,
        }));
      })
      .catch(error => console.error('Error fetching employee levels:', error));
  }, []);
 
  useEffect(() => {
    const fetchNewRequestId = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/get-max-request-id/max-request-id');
        const data = await response.json();
        if (response.ok) {
          setNewRequestId(data.newRequestId);
        } else {
          console.error('Failed to fetch new request ID:', data.message);
        }
      } catch (error) {
        console.error('Error fetching new request ID:', error);
      }
    };
 
    fetchNewRequestId();
  }, []);
 
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleDateChange = (newValue) => setFormData({ ...formData, selectedDate: newValue });
 
  const handleSourceChange = (e) => {
    const selectedSource = e.target.value;
    setFormData({ ...formData, selectedSource });
 
    // Fetch training objectives based on the selected source
    fetch(`http://localhost:8000/api/training/objectives?source_id=${selectedSource}`)
      .then(response => response.json())
      .then(data => {
        setFormData(prevFormData => ({
          ...prevFormData,
          trainingObjectives: data,
          selectedTrainingObjective: "",
        }));
      })
      .catch(error => console.error('Error fetching training objectives:', error));
  };
 
  const handleTrainingObjectiveChange = (e) => {
    const selectedTrainingObjective = e.target.value;
    setFormData({ ...formData, selectedTrainingObjective });
  };
 
  const handleTechStackChange = (e) => {
    const selectedTechStack = e.target.value;
    setFormData({ ...formData, selectedTechStack });
 
    // Fetch primary skills based on the selected tech stack
    fetch(`http://localhost:8000/api/primaryskill/by-stack?stack_id=${selectedTechStack}`)
      .then(response => response.json())
      .then(data => {
        setFormData(prevFormData => ({
          ...prevFormData,
          primarySkills: data,
          selectedPrimarySkill: "",
        }));
      })
      .catch(error => console.error('Error fetching primary skills:', error));
  };
 
  // Fetch projects data
  useEffect(() => {
    fetch(`http://localhost:8000/api/project/all`)
      .then(response => response.json())
      .then(data => {
        setFormData(prevFormData => ({
          ...prevFormData,
          projects: data,
        }));
      })
      .catch(error => console.error('Error fetching projects:', error));
  }, []);
 
  const handleEmployeeSearch = (event, value) => {
    if (value.length > 0) {
      fetch(`http://localhost:8000/api/employee/search?name=${value}`)
        .then(response => response.json())
        .then(data => {
          if (Array.isArray(data)) {
            setSearchResults(data.map(emp => ({
              id: emp.emp_id,
              name: emp.emp_name,
              email: emp.emp_email,
              uniqueKey: `${emp.emp_id}-${Date.now()}` // Add unique key
            })));
          } else {
            console.error('Unexpected response format for employee search by name:', data);
          }
        })
        .catch(error => console.error('Error fetching employees by name:', error));
    }
  };

 
  const addEmployee = () => {
    if (!selectedEmployee) return;
    if (!formData.employees.some(emp => emp.id === selectedEmployee.id)) {
      setFormData(prevFormData => ({
        ...prevFormData,
        employees: [...prevFormData.employees, selectedEmployee],
        showTable: true,
        showSummary: true,
      }));
      setSelectedEmployee(null); // Clear the selected employee after adding
    }
  };
 
  const removeEmployee = (id) => {
    setFormData({ ...formData, employees: formData.employees.filter(emp => emp.id !== id) });
  };
 
  const updateEmployee = (id, field, value) => {
    setFormData({
      ...formData,
      employees: formData.employees.map(emp => (emp.id === id ? { ...emp, [field]: value } : emp)),
    });
  };
 
  const handleSubmit = async () => {
    const formattedDate = formData.selectedDate ? formData.selectedDate.toISOString().split('T')[0] : null;
 
    const requestBody = {
      requestid: newRequestId, // Include the newRequestId here
      requestonbehalfof: user.role_id === 10 ? formData.requestonbehalf : user.emp_id, // Use emp_id for non-spoc roles
      requestedbyid: user.emp_id, // Add the current user's ID from the session
      source: formData.selectedSource,
      trainingobj: formData.selectedTrainingObjective,
      projectid: formData.trainingPurpose === "project" ? formData.selectedProject : null,
      newprospectname: formData.trainingPurpose === "prospect" ? formData.prospectName : null,
      numberofpeople: formData.trainingPurpose === "project" ? formData.numberOfPeople : null,
      employeelevel: formData.selectedEmployeeLevel,
      expecteddeadline: formattedDate,
      techstack: formData.selectedTechStack,
      primaryskill: formData.selectedPrimarySkill,
      otherskills: formData.otherSkill,
      suggestedcompletioncriteria: formData.completionCriteria,
      comments: formData.comment,
      servicedivision: formData.trainingPurpose === "prospect" ? formData.selectedServiceDivision : null,
    };
 
    console.log('Submitting request body to newtrainingrequest API:', requestBody); // Log the request body
 
    try {
      const response = await fetch('http://localhost:8000/api/newtrainingrequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
 
      if (response.ok) {
        console.log('New training request submitted successfully');
        setSnackbarMessage("New training request submitted successfully");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
       
        // Proceed with the existing API call
        const employeeLevelRequestBody = {
          requestid: newRequestId, // Use the newRequestId here
          employee_level_ids: formData.selectedEmployeeLevel, // Use selectedEmployeeLevel
        };
 
        console.log('Submitting request body to training-request/employee-levels API:', employeeLevelRequestBody); // Log the request body
 
        try {
          const employeeLevelResponse = await fetch('http://localhost:8000/api/training-request/employee-levels', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(employeeLevelRequestBody),
          });
 
          if (employeeLevelResponse.ok) {
            console.log('Employee levels submitted successfully');
          } else {
            console.error('Failed to submit employee levels');
            const errorData = await employeeLevelResponse.json();
            console.error('Error details:', errorData); // Log the error details from the server
            setSnackbarMessage(`Failed to submit employee levels: ${errorData.message}`);
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
          }
        } catch (error) {
          console.error('Error submitting employee levels:', error);
          setSnackbarMessage(`Error submitting employee levels: ${error.message}`);
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
 
        // New API call for adding employees if "Add Employees" is selected
        if (formData.employeeDetails === "add") {
          const empNewTrainingRequestBody = formData.employees.map(emp => ({
            emp_id: emp.id,
            availablefrom: emp.availableFrom,
            dailyband: emp.bandwidth,
            availableonweekend: emp.weekend === "Yes",
            requestid: newRequestId,
          }));
 
          console.log('Submitting request body to empNewTrainingRequested API:', empNewTrainingRequestBody); // Log the request body
 
          try {
            const empNewTrainingResponse = await fetch('http://localhost:8000/api/empNewTrainingRequested/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(empNewTrainingRequestBody),
            });
 
            if (empNewTrainingResponse.ok) {
              console.log('Employees added successfully');
              setSnackbarMessage("Employees added successfully");
              setSnackbarSeverity("success");
              setSnackbarOpen(true);
            } else {
              console.error('Failed to add employees');
              const errorData = await empNewTrainingResponse.json();
              console.error('Error details:', errorData); // Log the error details from the server
              setSnackbarMessage(`Failed to add employees: ${errorData.message}`);
              setSnackbarSeverity("error");
              setSnackbarOpen(true);
            }
          } catch (error) {
            console.error('Error adding employees:', error);
            setSnackbarMessage(`Error adding employees: ${error.message}`);
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
          }
        }
      } else {
        console.error('Failed to submit new training request');
        const errorData = await response.json();
        console.error('Error details:', errorData); // Log the error details from the server
        setSnackbarMessage(`Failed to submit new training request: ${errorData.message}`);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error submitting new training request:', error);
      setSnackbarMessage(`Error submitting new training request: ${error.message}`);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };


  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {/* <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh"> */}
        {/* <Container maxWidth="md" className="container"> */}
          <Paper  className="paper"  elevation={0}
        style={{ backgroundColor: " #F6FAFF", padding: "1rem",minWidth: '30%', flexWrap:"wrap" }}
 >
            <Typography variant="h5"
          gutterBottom
          className="mainHeading"
          style={{ fontWeight: "bold", fontSize: "14px" }}
>New Training Request</Typography>
          
        <Divider style={{ margin: "1rem 0" }} />

<Box  display="flex"
  flexDirection="row"
  justifyContent="flex-start" // Align the items to the left
  alignItems="center" // Vertically center the items
  marginBottom="1rem"
  gap={2}
  flexWrap="nowrap">
              <Typography className="subheader" style={{ whiteSpace: 'nowrap' }}>
 <strong> Request ID/No:</strong>
</Typography><Typography style={{ marginLeft: '0rem' }}>#{newRequestId !== null ? newRequestId : 'Loading...'}
</Typography>
              <Typography  className="subheader" style={{ whiteSpace: 'nowrap',  marginRight: '0.5rem' }}>
                <strong>Requested By:</strong>
                </Typography><Typography style={{ marginLeft: '0rem' }}><span>{user ? toPascalCase(user.name) : 'User'}</span></Typography>
            </Box>
            <Paper  elevation={1}
          style={{
            padding: "2rem",
            backgroundColor: "#FFFFFF",
           border:"#BFBFBF solid 0.5px"
          }}
>
              <Typography  className="simpleHeading" style={{ fontWeight: "bold", marginBottom: "1rem" }}
              >Training Details</Typography>
              <Box display="flex"
            flexDirection="row"
            justifyContent="space-between"
            marginBottom="1rem"
            gap={2}
>
<FormControl fullWidth className="formControl">
  <Typography className="subheader" style={{ display: 'inline', marginBottom: "0.5rem" }}>
    Request on behalf <span className="required" style={{ display: 'inline' }}>*</span>
  </Typography>
  {user.role_id === 10 ? (
    <Autocomplete
    options={searchResults}
    getOptionLabel={(option) => option.name || ""}
      
      name="requestonbehalf"
      onInputChange={handleEmployeeSearch}
      // value={formData.requestonbehalf}
      onChange={(event, value) => setFormData({ ...formData, requestonbehalf: value ? value.id : "" })}
      renderInput={(params) => <TextField {...params} variant="outlined" placeholder="Type employee name" />}
      InputProps={{ endAdornment: <SearchIcon color="disabled" /> }}
    />
  ) : (
    <Typography>{user.emp_id}</Typography>
  )}
</FormControl>
                <FormControl fullWidth className="formControl">
                  <Typography className="subheader"  style={{ display: 'inline' ,marginBottom: "0.5rem"}} >Source <span className="required">*</span>
                  </Typography>
                  <Select
                   
                    // variant="outlined"
                    name="source"
                    value={formData.selectedSource}
                    onChange={handleSourceChange}
                   
                    displayEmpty
                    style={{ height: "30px", fontSize: "12px", opacity: 0.5, }}
                    
    
                  >
                     <MenuItem disabled value="">
                     
            <em>Select Source</em>
          </MenuItem>
                    {formData.sources.map(source => (
                      
                      <MenuItem key={source.source_id} value={source.source_id} >
                         
                        {source.source_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth className="formControl">
                  <Typography className="subheader" style={{ display: 'inline' ,marginBottom: "0.5rem"}}>Training Objective <span className="required">*</span></Typography>
                  <Select
                    variant="outlined"
                    name="trainingObjective"
                    value={formData.selectedTrainingObjective}
                    onChange={handleTrainingObjectiveChange}
                    displayEmpty
                    style={{ height: "30px", fontSize: "12px", opacity:'0.5' }}
                  >
                    <MenuItem disabled value="">
                     
                     <em>Select Training Objective</em>
                   </MenuItem>
                    {formData.trainingObjectives.map(objective => (
                      
                      <MenuItem key={objective.training_id} value={objective.training_id}>
                        {objective.training_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Typography className="simpleHeading" style={{ fontWeight: "bold", marginBottom: "0.2rem" }}
 >Training Purpose</Typography>
              <FormControl component="fieldset" style={{ marginBottom: "0.5rem" }}>
                <RadioGroup row name="trainingPurpose" value={formData.trainingPurpose} onChange={handleChange}>
                  <FormControlLabel value="prospect" control={<CustomRadio />} label={<Typography className="subheader">Prospect</Typography>} />
                  <FormControlLabel value="project" control={<CustomRadio />} label={<Typography className="subheader">Project</Typography>} />
                </RadioGroup>
              </FormControl>
              {formData.trainingPurpose === "prospect" ? (
                <Box display="flex"
                flexDirection="row"
                justifyContent="space-between"
                marginBottom="1rem"
                gap={2}
  >
                  <FormControl fullWidth className="formControl">
                    <Typography className="subheader"  style={{ display: 'inline' ,marginBottom: "0.5rem"}} >Prospect Name <span className="required">*</span></Typography>
                    <TextField variant="outlined" placeholder="Enter Prospect" name="prospectName"  value={formData.prospectName}
                      onChange={handleChange}
                    InputProps={{
      endAdornment: <SearchIcon color="disabled" />,
      style: { fontSize: "0.85rem" } }} />
                  </FormControl>
                  <FormControl fullWidth className="formControl">
                    <Typography className="subheader" style={{ display: 'inline' ,marginBottom: "0.5rem"}}>Service Division <span className="required">*</span></Typography>
                    <Select variant="outlined" defaultValue="" name="selectedServiceDivision" value={formData.selectedServiceDivision} onChange={handleChange} displayEmpty 
                    style={{ height: "30px", fontSize: "12px", opacity:"0.5" }}>
                    <MenuItem disabled value="">
                     
                    <em>Select Service Division</em>
                   </MenuItem>
                      {formData.services.map(service => (
                        <MenuItem key={service.id} value={service.id} style={{ fontSize: "12px" , padding: "4px 4px 4px 6px" }}>
                          {service.service_name}
                          
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              ) : (
                <Box display="flex" flexDirection="row" justifyContent="space-between" marginBottom="1rem" gap={2}>
                  <FormControl fullWidth className="formControl">
                    <Typography className="subheader" style={{ display: 'inline' ,marginBottom: "0.5rem"}}>Project Name <span className="required">*</span></Typography>
                    <Select
                      variant="outlined"
                      name="prospectName"
                      value={formData.selectedProject}
                      onChange={(e) => setFormData({ ...formData, selectedProject: e.target.value })}
                      displayEmpty
                      style={{ height: "30px", fontSize: "12px", opacity: 0.5 }}
                    >
                      <MenuItem value=""><em>Select Project</em></MenuItem>
                      {formData.projects.map(project => (
                        <MenuItem key={project.ProjectID} value={project.ProjectID}>
                          {project.ProjectName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth className="formControl">
  <Typography className="subheader" style={{ display: 'inline', marginBottom: "0.5rem" }}>
    Service Division <span className="required">*</span>
  </Typography>
  <Select
    variant="outlined"
    name="selectedServiceDivision"
    value={formData.selectedServiceDivision}
    onChange={handleChange}
    displayEmpty
    style={{ height: "30px", fontSize: "12px", opacity: 0.5 }}
  >
    <MenuItem disabled value="">
                     
                     <em>Select Service Division</em>
                   </MenuItem>
    {formData.services.map(service => (
      <MenuItem key={service.id} value={service.id}>
        {service.service_name}
      </MenuItem>
    ))}
  </Select>
</FormControl>
                </Box>
              )}
              <Typography className="simpleHeading"  style={{ fontWeight: "bold", marginBottom: "0.5rem" }}
              >Employee Details</Typography>
              <FormControl component="fieldset" className="formControl" 
              style={{ marginBottom: "0.5rem" }}
            >
                <RadioGroup row name="employeeDetails" value={formData.employeeDetails} onChange={handleChange}>
                  <FormControlLabel value="add"  control={<CustomRadio />}  label={<Typography className="subheader" >Add Employees</Typography>} />
                  <FormControlLabel value="open" control={<CustomRadio />} label={<Typography className="subheader">Place an Open Request</Typography>} />
                </RadioGroup>
              </FormControl>
              <Box style={{ width: "100%" }}>
                {formData.employeeDetails === "add" ? (
                  <Box display="flex" flexDirection="column" marginBottom="1rem">
                    <Box display="flex" flexDirection="row" justifyContent="space-between" marginBottom="1rem" gap={2}>
                    <FormControl fullWidth className="formControl">
                        <Typography className="subheader"  style={{ display: 'inline' ,marginBottom: "0.5rem"}}>Select Employee <span className="required">*</span></Typography>
                        <Autocomplete
                          options={searchResults}
                          getOptionLabel={(option) => option.name || ""}
                          onInputChange={handleEmployeeSearch}
                          onChange={(event, value) => setSelectedEmployee(value)}
                          renderInput={(params) => <TextField {...params} variant="outlined" placeholder="Type employee name" />}
                        />
                      </FormControl>
                      <Typography className="subheader" align="center" style={{ margin: " 30px" }}>OR</Typography>
                      <FormControl fullWidth className="formControl">
                        <Typography className="subheader"  style={{ display: 'inline' ,marginBottom: "0.5rem"}} >Enter comma(,) separated email ids <span className="required">*</span></Typography>
                        <TextField variant="outlined" name="emails" value={formData.emails} onChange={handleChange} />
                      </FormControl>
                      <Box marginTop="1.5rem" display="flex" justifyContent="flex-end">
                      <Button variant="contained" onClick={addEmployee} sx={{ height: "35px", fontSize: "12px", minWidth: "75px" }}>+</Button>
                    </Box>
                    </Box>
                    {formData.showTable && (
                      <TableContainer component={Paper} className="tableContainer">
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell className="tableHeader">Employee ID</TableCell>
                              <TableCell className="tableHeader">Name</TableCell>
                              <TableCell className="tableHeader">Available From</TableCell>
                              <TableCell className="tableHeader">Daily Bandwidth</TableCell>
                              <TableCell className="tableHeader">Available on Weekend?</TableCell>
                              <TableCell className="tableHeader">Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {formData.employees.slice(formData.page * formData.rowsPerPage, formData.page * formData.rowsPerPage + formData.rowsPerPage).map((employee) => (
                              <TableRow key={employee.uniqueKey}>
                                <TableCell>
                                  <Box display="flex" alignItems="center" gap={1}>
                                    <Avatar src={employee.image} />
                                    {employee.id}
                                  </Box>
                                </TableCell>
                                <TableCell>{employee.name}</TableCell>
                                <TableCell>
                                  <TextField type="date" value={employee.availableFrom} onChange={(e) => updateEmployee(employee.id, "availableFrom", e.target.value)} size="small" />
                                </TableCell>
                                <TableCell>
                                  <Select value={employee.bandwidth} onChange={(e) => updateEmployee(employee.id, "bandwidth", e.target.value)} size="small">
                                    <MenuItem value="">Select</MenuItem>
                                    <MenuItem value="2 Hours">2 Hours</MenuItem>
                                    <MenuItem value="4 Hours">4 Hours</MenuItem>
                                    <MenuItem value="6 Hours">6 Hours</MenuItem>
                                    <MenuItem value="Full Day">Full Day</MenuItem>
                                  </Select>
                                </TableCell>
                                <TableCell>
                                  <RadioGroup row value={employee.weekend} onChange={(e) => updateEmployee(employee.id, "weekend", e.target.value)}>
                                    <FormControlLabel value="Yes" control={<Radio size="small" />} label="Yes" />
                                    <FormControlLabel value="No" control={<Radio size="small" />} label="No" />
                                  </RadioGroup>
                                </TableCell>
                                <TableCell>
                                  <IconButton color="error" onClick={() => removeEmployee(employee.id)} size="small"><CloseIcon /></IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        <TablePagination
                          rowsPerPageOptions={[5, 10, 25]}
                          component="div"
                          count={formData.employees.length}
                          rowsPerPage={formData.rowsPerPage}
                          page={formData.page}
                          onPageChange={(e, newPage) => setFormData({ ...formData, page: newPage })}
                          onRowsPerPageChange={(e) => setFormData({ ...formData, rowsPerPage: parseInt(e.target.value, 10), page: 0 })}
                        />
                      </TableContainer>
                                        )}
                                        {formData.showSummary && <Typography>Total employees selected:
                                            {formData.employees.length}</Typography>}
                                    </Box>

                                ) : (
                                    <Box display="flex" flexDirection="column" marginBottom="1rem">
                                        <Box display="flex" flexDirection="row" justifyContent="space-between"
                                            marginBottom="1rem" gap={2}>
                                            <FormControl fullWidth className="formControl">
  <Typography className="subheader" style={{ display: 'inline', marginBottom: "0.5rem" }}>
    Number of People <span className="required" style={{ display: 'inline' }}>*</span>
  </Typography>
  <TextField
    variant="outlined"
    name="numberOfPeople"
    value={formData.numberOfPeople}
    onChange={handleChange}
    placeholder="Enter number of people"
    InputProps={{
      endAdornment: <SearchIcon color="disabled" />,
      style: { fontSize: "0.85rem" } }} 
  />
</FormControl>
   <FormControl fullWidth className="formControl">
  <Typography className="subheader" style={{ display: 'inline' ,marginBottom: "0.5rem"}}>Employee Level <span className="required">*</span></Typography>
  <Select
    variant="outlined"
    name="employeeLevel"
    value={formData.selectedEmployeeLevel}
    SelectDisplayProps={{ style: { fontSize: "12px" } }}
    onChange={(e) => setFormData({
      ...formData, selectedEmployeeLevel: e.target.value
    })}
    multiple // Allow multiple selections
    style={{ height: "30px", fontSize: "12px" , opacity: 1}}
  >
    <MenuItem disabled value="">
                     
                     <em>Select Employee Level</em>
                   </MenuItem>
    
    {formData.employeeLevels.map(level => (
      <MenuItem key={level.id} value={level.id}>
        {level.job_title}
      </MenuItem>
    ))}
  </Select>
</FormControl>
                                        </Box>
                                    </Box>
                                )}
                            </Box>
                            <Typography className="simpleHeading"  style={{ fontWeight: "bold", marginBottom: "1rem" }}
                            >Skill Details</Typography>
                            <Box display="flex" flexDirection="row" justifyContent="space-between"
                                marginBottom="1rem" gap={2}>
                                <FormControl fullWidth className="formControl">
                                    <Typography className="subheader" noWrap style={{ display: 'inline' , marginBottom: "0.5rem",}} > Expected completion Timeline <span
                                        className="required" >*</span></Typography>
                                    <DatePicker className="text" value={formData.selectedDate} onChange={handleDateChange}
                                        renderInput={(params) => <TextField {...params} variant="outlined" />} />
                                </FormControl>
                                <FormControl fullWidth className="formControl">
                                    <Typography className="subheader" noWrap style={{ display: 'inline' ,marginBottom: "0.5rem"}}>Request for - Tech Stack / Area <span
                                        className="required">*</span></Typography>
                                    <Select
                                        variant="outlined"
                                        name="techStack"
                                        value={formData.selectedTechStack}
                                        onChange={handleTechStackChange}
                                        displayEmpty
                                        style={{ height: "30px",width:"250px",marginLeft: "6px", fontSize: "12px" , opacity: 0.5, fontStyle:'normal'}}
                                    
                                        MenuProps={{
                                          PaperProps: {
                                            style: {
                                              maxHeight: 300, // Adjust the max height of the dropdown menu
                                              width: 100, // Adjust the width of the dropdown menu
                                              fontSize: "2px", // Adjust font size inside the dropdown
                                            },
                                          },
                                        }}
                                    >
                                        <MenuItem disabled value=""><em>Select Tech Stack</em></MenuItem>
                                        {formData.techStacks.map(stack => (
                                            <MenuItem key={stack.stack_id} value={stack.stack_id}>
                                                {stack.stack_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth className="formControl">
                                    <Typography className="subheader" noWrap style={{ display: 'inline' ,marginBottom: "0.5rem"}}>Request for - Primary Skill / Competency
                                        <span className="required">*</span></Typography>
                                    <Select 
                                        variant="outlined"
                                        name="primarySkill"
                                        value={formData.selectedPrimarySkill}
                                        displayEmpty
                                        onChange={(e) => setFormData({
                                            ...formData, selectedPrimarySkill: e.target.value
                                        })}
                                        style={{ height: "30px",width:"250px",marginLeft: "14px", fontSize: "12px", opacity: 0.5 }}

                                        MenuProps={{
                                          PaperProps: {
                                            style: {
                                              maxHeight: 300, // Adjust the max height of the dropdown menu
                                              width: 50, // Adjust the width of the dropdown menu
                                              fontSize: "4px" , // Adjust font size inside the dropdown
                                            },
                                          },
                                        }}
                                    >
                                        <MenuItem disabled value=""><em>Select Skill</em></MenuItem>
                                        {formData.primarySkills.map(skill => (
                                            <MenuItem key={skill.skill_id} value={skill.skill_id}>
                                                {skill.skill_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box  display="flex"
  flexDirection="row"
  justifyContent="space-between"
  alignItems="flex-start" // Adjust alignment to the start for better layout
  marginBottom="1rem"
  gap={2}
  flexWrap="nowrap"
>
                                <FormControl fullWidth className="formControl" style={{ width: '30%' }}>
                                    <Typography className="subheader" style={{ display: 'inline' ,marginBottom: "0.5rem"}}>Provide other skills information <span
                                        className="required">*</span></Typography>
                                        <Box style={{ height: 'auto', width: '100%' }}>
                                    <ReactQuill
                                        value={formData.otherSkill}
                                        onChange={(value) => setFormData({ ...formData, otherSkill: value })}
        modules={{
          toolbar: [["bold", "italic", "underline"]],
        }}
        placeholder="Other Skill Details should be less than 1000 words"
        style={{
          height: '200px', // Fixed height
          width: '100%', // Full width of container
          // overflowY: 'auto', // Enable vertical scrolling if content exceeds
        }}


                                    />
                                    </Box>
                                </FormControl>
                                <FormControl fullWidth className="formControl" style={{ width: '30%' }}>
                                    <Typography className="subheader" style={{ display: 'inline' ,marginBottom: "0.5rem"}}>Suggest completion criteria <span
                                        className="required">*</span></Typography>


<Box style={{ height: 'auto', width: '100%' }}>

                                    <ReactQuill
                                        value={formData.completionCriteria}
                                        onChange={(value) => setFormData({ ...formData, completionCriteria: value })}
                                        modules={{
                                          toolbar: [["bold", "italic", "underline"]],
                                        }}
                                        placeholder="Suggest Completion criteria should be less than 1000 words"
                                        style={{
                                          height: '200px',
                                          width: '100%',
                                          // overflowY: 'auto', // Add scroll if content exceeds
                                        }}
                                
                                    />
                                    </Box>
                                </FormControl>
                                <FormControl fullWidth className="formControl" style={{ width: '30%' }}>
                                    <Typography className="subheader" style={{ display: 'inline' ,marginBottom: "0.5rem"}}>Comments</Typography>
                                    <Box style={{ height: 'auto', width: '100%' }}>
                                    <ReactQuill
                                        value={formData.comment}
                                        onChange={(value) => setFormData({ ...formData, comment: value })}
                                        modules={{
                                          toolbar: [["bold", "italic", "underline"]],
                                        }}
                                        placeholder="Comments should be less than 350 words"
                                        style={{
                                          height: '200px',
                                          width: '100%',
                                          // overflowY: 'auto', // Enable scroll if content exceeds
                                        }}
                                
                                    />
                                    </Box>
                                </FormControl>
                            </Box>
                            <Box className="buttonGroup  ButtonBox">
                                <Button variant="outlined" style={{ minWidth: "75px" }}>Cancel</Button>
                                <Button variant="contained" style={{ minWidth: "75px" }} onClick={handleSubmit}>Submit</Button>
                            </Box>
                        </Paper>
                    </Paper>
                {/* </Container> */}
            {/* </Box> */}
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
      <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
        {snackbarMessage}
      </Alert>
    </Snackbar>
        </LocalizationProvider>
    );
};
export default NewTrainingRequest;