import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {  Paper,  Typography,  Select,  MenuItem,  FormControl,  RadioGroup,  TextField,  FormControlLabel,
  Radio,  Button,  Box,  Divider,  TableCell,  TableContainer,  TableBody,  TableHead,  TableRow,
  Table,  IconButton,  Avatar,  Autocomplete,  Dialog,  DialogTitle,} from "@mui/material";
import { styled } from "@mui/material/styles";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import CloseIcon from "@mui/icons-material/Close";
import TablePagination from "@mui/material/TablePagination";
import ReactQuill from "react-quill-new"; // Import react-quill-new
import "react-quill-new/dist/quill.snow.css"; // Import styles for react-quill-new
import "./NewTrainingRequest.css"; // Import the CSS file
import AuthContext from "../Auth/AuthContext";
// import { Snackbar, Alert } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { toPascalCase } from "../../utils/stringUtils";
import getRoleType from '../../utils/roleUtils';

const CustomRadio = styled(Radio)({
  "& .MuiSvgIcon-root": { fontSize: 16 },
});

const NewTrainingRequest = () => {
  const navigate = useNavigate();
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
    selectedPrimarySkill: [],
    projects: [],
    selectedProject: "",
    selectedEmployeeLevel: [],
    services: [],
    requestonbehalf: "",
    prospectName: "",
    selectedServiceDivision: "",
  });

  const role = getRoleType(user.role_id);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [newRequestId, setNewRequestId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [isFormValid, setIsFormValid] = useState(false);

  const validateForm = () => {
    const requiredFields = [
      formData.selectedSource,
      formData.selectedTrainingObjective,
      formData.selectedDate,
      formData.selectedTechStack,
      formData.selectedPrimarySkill,
      formData.otherSkill,
      formData.completionCriteria,
    ];
  
    if (formData.trainingPurpose === "prospect") {
      requiredFields.push(formData.prospectName, formData.selectedServiceDivision);
    } else if (formData.trainingPurpose === "project") {
      requiredFields.push(formData.selectedProject, formData.selectedServiceDivision);
    }
  
    if (formData.employeeDetails === "open" && role === "CapDev") {
      requiredFields.push(formData.numberOfPeople, formData.selectedEmployeeLevel);
    }
  
    if (formData.employeeDetails === "add") {
      requiredFields.push(...formData.employees.map(emp => emp.id));
      // Check if all table fields are filled
      const allTableFieldsFilled = formData.employees.every(emp =>
        emp.availableFrom && emp.bandwidth && emp.weekend
      );
      if (!allTableFieldsFilled) {
        return false;
      }
    }
  
    // Ensure otherSkill and completionCriteria are not empty
    if (!formData.otherSkill || !formData.completionCriteria) {
      return false;
    }
  
    return requiredFields.every(field => field !== "" && field !== null);
  };
  
  useEffect(() => {
    setIsFormValid(validateForm());
  }, [formData, formData.employees, formData.otherSkill, formData.completionCriteria]);
  
  const handleOtherSkillChange = (value) => {
    const sanitizedValue = value === '<p><br></p>' ? '' : value;
    setFormData({ ...formData, otherSkill: sanitizedValue });
    setIsFormValid(validateForm());
  };
  
  const handleCompletionCriteriaChange = (value) => {
    const sanitizedValue = value === '<p><br></p>' ? '' : value;
    setFormData({ ...formData, completionCriteria: sanitizedValue });
    setIsFormValid(validateForm());
  };
  
  useEffect(() => {
    if (user) {
      fetch(`http://localhost:8000/api/role/sources?role_id=${user.role_id}`)
        .then((response) => response.json())
        .then((data) => {
          setFormData((prevFormData) => ({
            ...prevFormData,
            sources: data,
          }));
        })
        .catch((error) => console.error("Error fetching sources:", error));
    }
    // Fetch tech stacks
    fetch(`http://localhost:8000/api/techstack/all`)
      .then((response) => response.json())
      .then((data) => {
        setFormData((prevFormData) => ({
          ...prevFormData,
          techStacks: data,
        }));
      })
      .catch((error) => console.error("Error fetching tech stacks:", error));
  }, [user]);

  useEffect(() => {
    // Fetch services data
    fetch(`http://localhost:8000/api/services`)
      .then((response) => response.json())
      .then((data) => {
        setFormData((prevFormData) => ({
          ...prevFormData,
          services: data.services,
        }));
      })
      .catch((error) => console.error("Error fetching services:", error));
  }, []);

  useEffect(() => {
    // Fetch employee levels data
    fetch(`http://localhost:8000/api/employee-level/all`)
      .then((response) => response.json())
      .then((data) => {
        setFormData((prevFormData) => ({
          ...prevFormData,
          employeeLevels: data,
        }));
      })
      .catch((error) =>
        console.error("Error fetching employee levels:", error)
      );
  }, []);

  useEffect(() => {
    const fetchNewRequestId = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/get-max-request-id/max-request-id"
        );
        const data = await response.json();
        if (response.ok) {
          setNewRequestId(data.newRequestId);
        } else {
          console.error("Failed to fetch new request ID:", data.message);
        }
      } catch (error) {
        console.error("Error fetching new request ID:", error);
      }
    };

    fetchNewRequestId();
  }, []);

  useEffect(() => {
    if (user.role_id !== 4) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        requestonbehalf: user.emp_id,
      }));
    }
  }, [user]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setIsFormValid(validateForm());
  };
  const handleDateChange = (newValue) => {
    setFormData({ ...formData, selectedDate: newValue });
    setIsFormValid(validateForm());
  };

  const handleSourceChange = (e) => {
    const selectedSource = e.target.value;
    setFormData({ ...formData, selectedSource });
    setIsFormValid(validateForm());

    // Fetch training objectives based on the selected source
    fetch(
      `http://localhost:8000/api/training/objectives?source_id=${selectedSource}`
    )
      .then((response) => response.json())
      .then((data) => {
        setFormData((prevFormData) => ({
          ...prevFormData,
          trainingObjectives: data,
          selectedTrainingObjective: "",
        }));
        setIsFormValid(validateForm());
      })
      .catch((error) =>
        console.error("Error fetching training objectives:", error)
      );
  };

    const handleTrainingObjectiveChange = (e) => {
      const selectedTrainingObjective = e.target.value;
      setFormData({ ...formData, selectedTrainingObjective });
      setIsFormValid(validateForm());
    };

    const handleTechStackChange = (e) => {
      const selectedTechStack = e.target.value;
      setFormData({ ...formData, selectedTechStack });
      setIsFormValid(validateForm());
  
      // Fetch primary skills based on the selected tech stack
      fetch(
        `http://localhost:8000/api/primaryskill/by-stack?stack_id=${selectedTechStack}`
      )
        .then((response) => response.json())
        .then((data) => {
          setFormData((prevFormData) => ({
            ...prevFormData,
            primarySkills: data,
            selectedPrimarySkill: [],
          }));
          setIsFormValid(validateForm());
        })
        .catch((error) => console.error("Error fetching primary skills:", error));
    };

  // Fetch projects data
  useEffect(() => {
    fetch(`http://localhost:8000/api/project/all`)
      .then((response) => response.json())
      .then((data) => {
        setFormData((prevFormData) => ({
          ...prevFormData,
          projects: data,
        }));
      })
      .catch((error) => console.error("Error fetching projects:", error));
  }, []);

  const handleEmployeeSearch = (event, value) => {
    if (value.length > 0) {
      const managerId = formData.requestonbehalf; 
      fetch(`http://localhost:8000/api/employeeSearchByName/searchEmployeesByName?managerId=${managerId}&name=${value}`)
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setSearchResults(
              data.map((emp) => ({
                id: emp.emp_id,
                name: emp.emp_name,
                email: emp.emp_email,
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

  const handleManagerSearch = (event, value) => {
    if (value.length > 0) {
      fetch(`http://localhost:8000/api/managerSearchByName/searchManagersByName?name=${value}`)
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setSearchResults(
              data.map((manager) => ({
                id: manager.manager_id,
                name: manager.manager_name,
                email: manager.manager_email,
                uniqueKey: `${manager.manager_id}-${Date.now()}`, // Add unique key
              }))
            );
          } else {
            console.error(
              "Unexpected response format for manager search by name:",
              data
            );
          }
        })
        .catch((error) =>
          console.error("Error fetching managers by name:", error)
        );
    }
  };

  const handleEmailSearch = async (email) => {
    try {
      
      const response = await fetch(
        `http://localhost:8000/api/employeeSearchByEmail/searchEmployeesByManagerIdAndEmail?managerid=${formData.requestonbehalf}&emailPrefix=${email}`
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

  const addEmployee = async () => {
    const newEmployees = [];
    const invalidEmails = [];

    // Add selected employee from "Select Employee" field
    if (
      selectedEmployee &&
      !formData.employees.some((emp) => emp.id === selectedEmployee.id)
    ) {
      newEmployees.push({
        ...selectedEmployee,
        availableFrom: "",
        bandwidth: "",
        weekend: "",
      });
      setSelectedEmployee(null); // Clear the selected employee after adding
    }

    // Process comma-separated emails
    if (formData.emails.trim() !== "") {
      const emailList = formData.emails.split(",").map((email) => email.trim());
      const uniqueEmails = [...new Set(emailList)]; // Remove duplicate emails

      for (const email of uniqueEmails) {
        const employee = await handleEmailSearch(email);
        if (employee) {
          newEmployees.push(employee);
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

    setFormData((prevFormData) => ({
      ...prevFormData,
      employees: [...prevFormData.employees, ...newEmployees],
      showTable: true,
      showSummary: true,
      emails: "", // Clear the email input field
      invalidEmails: invalidEmails, // Store invalid emails
    }));
    setIsFormValid(validateForm());
  };
  const removeEmployee = (id) => {
    setFormData({
      ...formData,
      employees: formData.employees.filter((emp) => emp.id !== id),
    });
    setIsFormValid(validateForm());
  };


  const updateEmployee = (id, field, value) => {
    setFormData({
      ...formData,
      employees: formData.employees.map((emp) =>
        emp.id === id ? { ...emp, [field]: value } : emp
      ),
    });
    setIsFormValid(validateForm());
  };


  const updateAllEmployees = (updates) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      employees: prevFormData.employees.map((emp) => ({
        ...emp,
        ...updates,
      })),
    }));
    setIsFormValid(validateForm());
  };

  const submitPrimarySkills = async (requestId, primarySkillIds) => {
    const requestBody = {
      requestid: requestId,
      primary_skill_ids: primarySkillIds,
    };
  
    console.log("Submitting primary skills to API:", requestBody); // Log the request body
  
    try {
      const response = await fetch(
        "http://localhost:8000/api/trainingRequestPrimarySkills/storePrimarySkills",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );
  
      if (response.ok) {
        console.log("Primary skills submitted successfully");
      } else {
        console.error("Failed to submit primary skills");
        const errorData = await response.json();
        console.error("Error details:", errorData); // Log the error details from the server
        setSnackbarMessage(`Failed to submit primary skills: ${errorData.message}`);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error submitting primary skills:", error);
      setSnackbarMessage(`Error submitting primary skills: ${error.message}`);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };
  
  const handleSubmit = async () => {
    const formattedDate = formData.selectedDate
      ? formData.selectedDate.toISOString().split("T")[0]
      : null;
  
    const requestBody = {
      requestid: newRequestId, // Include the newRequestId here
      requestonbehalfof: user.role_id === 4 ? formData.requestonbehalf : user.emp_id, // Use emp_id for non-CapDev roles
      requestedbyid: user.emp_id, // Add the current user's ID from the session
      source: formData.selectedSource,
      trainingobj: formData.selectedTrainingObjective,
      projectid: formData.trainingPurpose === "project" ? formData.selectedProject : null,
      newprospectname: formData.trainingPurpose === "prospect" ? formData.prospectName : null,
      expecteddeadline: formattedDate,
      techstack: formData.selectedTechStack,
      otherskill: formData.otherSkill,
      suggestedcompletioncriteria: formData.completionCriteria,
      comments: formData.comment,
      servicedivision: formData.selectedServiceDivision, // Include for both project and prospect
    };
  
    console.log("Submitting request body to newtrainingrequest API:", requestBody); // Log the request body
  
    try {
      const response = await fetch(
        "http://localhost:8000/api/newtrainingrequest",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );
  
      if (response.ok) {
        console.log("New training request submitted successfully");
        setDialogOpen(true);
  
        // Submit primary skills
        await submitPrimarySkills(newRequestId, formData.selectedPrimarySkill);
  
        // Proceed with the existing API call for employee levels
        const employeeLevelRequestBody = {
          requestid: newRequestId, // Use the newRequestId here
          employee_level_ids: formData.selectedEmployeeLevel, // Use selectedEmployeeLevel
        };
  
        console.log("Submitting request body to training-request/employee-levels API:", employeeLevelRequestBody); // Log the request body
  
        try {
          const employeeLevelResponse = await fetch(
            "http://localhost:8000/api/training-request/employee-levels",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(employeeLevelRequestBody),
            }
          );
  
          if (employeeLevelResponse.ok) {
            console.log("Employee levels submitted successfully");
          } else {
            console.error("Failed to submit employee levels");
            const errorData = await employeeLevelResponse.json();
            console.error("Error details:", errorData); // Log the error details from the server
            setSnackbarMessage(`Failed to submit employee levels: ${errorData.message}`);
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
          }
        } catch (error) {
          console.error("Error submitting employee levels:", error);
          setSnackbarMessage(`Error submitting employee levels: ${error.message}`);
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
  
        // New API call for adding employees if "Add Employees" is selected
        if (formData.employeeDetails === "add") {
          const empNewTrainingRequestBody = formData.employees.map((emp) => ({
            emp_id: emp.id,
            availablefrom: emp.availableFrom,
            dailyband: emp.bandwidth,
            availableonweekend: emp.weekend === "Yes",
            requestid: newRequestId,
          }));
  
          console.log("Submitting request body to empNewTrainingRequested API:", empNewTrainingRequestBody); // Log the request body
  
          try {
            const empNewTrainingResponse = await fetch(
              "http://localhost:8000/api/empNewTrainingRequested",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(empNewTrainingRequestBody),
              }
            );
  
            if (empNewTrainingResponse.ok) {
              console.log("Employees added successfully");
            } else {
              console.error("Failed to add employees");
              const errorData = await empNewTrainingResponse.json();
              console.error("Error details:", errorData); // Log the error details from the server
              setSnackbarMessage(`Failed to add employees: ${errorData.message}`);
              setSnackbarSeverity("error");
              setSnackbarOpen(true);
            }
          } catch (error) {
            console.error("Error adding employees:", error);
            setSnackbarMessage(`Error adding employees: ${error.message}`);
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
          }
        }
      } else {
        console.error("Failed to submit new training request");
        const errorData = await response.json();
        console.error("Error details:", errorData); // Log the error details from the server
        setSnackbarMessage(`Failed to submit new training request: ${errorData.message}`);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error submitting new training request:", error);
      setSnackbarMessage(`Error submitting new training request: ${error.message}`);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Typography
        variant="h5"
        gutterBottom
        className="mainHeading"
        style={{ fontWeight: "bold", fontSize: "14px" }}
      >
        New Learning Request
      </Typography>
      <Divider
        style={{ margin: "1rem 0 ", marginLeft: "-30px", marginRight: "-40px" }}
      />
      <Paper
        className="paper"
        elevation={0}
        style={{
          backgroundColor: "#F2F3F7F7",
          padding: "1rem",
          minWidth: "30%",
          flexWrap: "wrap",
        }}
      >
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="flex-start" // Align the items to the left
          alignItems="center" // Vertically center the items
          marginBottom="1rem"
          gap={2}
          flexWrap="nowrap"
        >
          <Typography className="subheader" style={{ whiteSpace: "nowrap" }}>
            Request ID/No:
          </Typography>
          <Typography style={{ marginLeft: "-0.85rem" }}>
            <strong>
              {" "}
              #{newRequestId !== null ? newRequestId : "Loading..."}{" "}
            </strong>
          </Typography>
          <Typography
            className="subheader"
            style={{ whiteSpace: "nowrap", marginRight: "0rem" }}
          >
            Requested By:
          </Typography>
          <Typography style={{ marginLeft: "-0.85rem" }}>
            <strong>
              {" "}
              <span>{user ? toPascalCase(user.name) : "User"}</span>
            </strong>
          </Typography>
        </Box>
        <Paper
          elevation={1}
          style={{
            padding: "2rem",
            backgroundColor: "#FFFFFF",
            border: "#BFBFBF solid 0.5px",
          }}
        >
          <Typography
            className="simpleHeading"
            style={{ fontWeight: "bold", marginBottom: "1rem" }}
          >
            Learning Details
          </Typography>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            marginBottom="1rem"
            gap={2}
          >

<FormControl fullWidth className="formControl">
  <Typography
    className="subheader"
    style={{ display: "inline", marginBottom: "0.5rem", marginLeft: '0rem' }}
  >
    Request on behalf{" "}
    <span className="required" style={{ display: "inline" }}>
      *
    </span>
  </Typography>
  {user.role_id === 4 ? (
    <Autocomplete
      options={searchResults}
      getOptionLabel={(option) => option.name || ""}
      name="requestonbehalf"
      onInputChange={handleManagerSearch}
      onChange={(event, value) =>
        setFormData({
          ...formData,
          requestonbehalf: value ? value.id : "",
        })
      }
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          style={{
            height: "20px",
            width: "250px", // Match the width of the Select component
            marginLeft: "2px",
            fontSize: "12px",
            fontStyle: "normal",
          }}
          InputProps={{
            ...params.InputProps,
          }}
          InputLabelProps={{
            style: { fontSize: "10px", opacity: "0.75" }, // Adjust placeholder text size and opacity
          }}
        />
      )}
      PaperComponent={(props) => (
        <Paper
          {...props}
          style={{
            maxHeight: 300, // Adjust the max height of the dropdown menu
            width: 240, // Match the width of the Select component
            fontSize: "12px", // Adjust font size inside the dropdown
          }}
        />
      )}
      renderOption={(props, option) => (
        <li
          {...props}
          style={{
            fontSize: "12px",
            padding: "4px 4px 4px 6px",
          }}
        >
          {option.name}
        </li>
      )}
    />
  ) : (
    <Typography>{user ? toPascalCase(user.name) : "User"}</Typography>
  )}
</FormControl>

            <FormControl fullWidth className="formControl">
              <Typography
                className="subheader"
                style={{
                  display: "inline",
                  marginBottom: "0.5rem",
                  marginLeft: "0rem",
                  marginRight: "0.8rem",
                }}
              >
                Source <span className="required">*</span>
              </Typography>
              <Select
                variant="outlined"
                name="source"
                value={formData.selectedSource}
                onChange={handleSourceChange}
                displayEmpty
                style={{ height: "30px", fontSize: "12px", maxWidth: "250px" }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300, // Adjust the max height of the dropdown menu
                      width: 40, // Adjust the width of the dropdown menu
                      fontSize: "12px", // Adjust font size inside the dropdown
                    },
                  },
                }}
              >
                <MenuItem
                  disabled
                  value=""
                  style={{ fontSize: "12px", padding: "4px 4px 4px 6px" }}
                >
                  <em style={{ height: "30px", opacity: "0.75" }}>
                    Select Source
                  </em>
                </MenuItem>
                {formData.sources.map((source) => (
                  <MenuItem
                    key={source.source_id}
                    value={source.source_id}
                    style={{ fontSize: "12px", padding: "4px 4px 4px 6px" }}
                  >
                    {source.source_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth className="formControl">
              <Typography
                className="subheader"
                style={{ display: "inline", marginBottom: "0.5rem" }}
              >
                Learning Objective <span className="required">*</span>
              </Typography>
              <Select
                variant="outlined"
                name="trainingObjective"
                value={formData.selectedTrainingObjective}
                onChange={handleTrainingObjectiveChange}
                displayEmpty
                style={{ height: "30px", fontSize: "12px" }}
              >
                <MenuItem
                  disabled
                  value=""
                  style={{ fontSize: "12px", padding: "4px 4px 4px 6px" }}
                >
                  <em style={{ height: "30px", opacity: "0.75" }}>
                    Select Learning Objective
                  </em>
                </MenuItem>
                {formData.trainingObjectives.map((objective) => (
                  <MenuItem
                    key={objective.training_id}
                    value={objective.training_id}
                    style={{ fontSize: "12px", padding: "4px 4px 4px 6px" }}
                  >
                    {objective.training_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Typography
            className="simpleHeading"
            style={{ fontWeight: "bold", marginBottom: "0.2rem" }}
          >
            Learning Purpose
          </Typography>
          <FormControl component="fieldset" style={{ marginBottom: "0.5rem" }}>
            <RadioGroup
              row
              name="trainingPurpose"
              value={formData.trainingPurpose}
              onChange={handleChange}
            >
              <FormControlLabel
                value="prospect"
                control={<CustomRadio />}
                label={
                  <Typography
                    className="subheader"
                    style={{ marginLeft: "-6px" }}
                  >
                    Prospect
                  </Typography>
                }
              />
              <FormControlLabel
                value="project"
                control={<CustomRadio />}
                label={
                  <Typography
                    className="subheader"
                    style={{ marginLeft: "-6px" }}
                  >
                    Project
                  </Typography>
                }
              />
            </RadioGroup>
          </FormControl>
          {formData.trainingPurpose === "prospect" ? (
            <Box
              display="flex"
              flexDirection="row"
              marginBottom="1rem"
              gap={2}
              flexWrap="wrap"
            >
              <FormControl
                fullWidth
                className="formControl"
                style={{
                  flexBasis: "30%",
                  minWidth: "250px",
                  display: "flex",
                  marginLeft: "0", // Remove unnecessary left margin
                  marginRight: "0.6rem",
                }}
              >
                <Typography
                  className="subheader"
                  style={{ display: "inline", marginBottom: "0.5rem" }}
                >
                  Prospect Name <span className="required">*</span>
                </Typography>
                <TextField
                  variant="outlined"
                  placeholder="Enter Prospect"
                  name="prospectName"
                  value={formData.prospectName}
                  onChange={handleChange}
                  InputProps={{
                    style: { fontSize: "12px" },
                  }}
                />
              </FormControl>
              <FormControl
                fullWidth
                className="formControl"
                style={{
                  flexBasis: "30%",
                  minWidth: "250px",
                  display: "flex",
                  marginLeft: "0rem", // Remove unnecessary left margin
                  marginRight: "0.3rem", // Add right margin to separate form controls
                }}
              >
                <Typography
                  className="subheader"
                  style={{ display: "inline", marginBottom: "0.5rem" }}
                >
                  Service Division <span className="required">*</span>
                </Typography>
                <Select
                  variant="outlined"
                  defaultValue=""
                  name="selectedServiceDivision"
                  value={formData.selectedServiceDivision}
                  onChange={handleChange}
                  displayEmpty
                  style={{ height: "30px", fontSize: "12px" }}
                >
                  <MenuItem
                    disabled
                    value=""
                    style={{ fontSize: "12px", padding: "4px 4px 4px 6px" }}
                  >
                    <em style={{ height: "30px", opacity: "0.75" }}>
                      Select Service Division
                    </em>
                  </MenuItem>
                  {formData.services.map((service) => (
                    <MenuItem
                      key={service.id}
                      value={service.id}
                      style={{ fontSize: "12px", padding: "4px 4px 4px 6px" }}
                    >
                      {service.service_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          ) : (
            <Box
              display="flex"
              flexDirection="row"
              marginBottom="1rem"
              gap={2}
              flexWrap="wrap"
            >
              <FormControl
                fullWidth
                className="formControl"
                style={{
                  flexBasis: "30%",
                  minWidth: "250px",
                  display: "flex",
                  marginLeft: "0", // Remove unnecessary left margin
                  marginRight: "0.6rem",
                }}
              >
                <Typography
                  className="subheader"
                  style={{ display: "inline", marginBottom: "0.5rem" }}
                >
                  Project Name <span className="required">*</span>
                </Typography>
                <Select
                  variant="outlined"
                  name="prospectName"
                  value={formData.selectedProject}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      selectedProject:
                        e.target.value === formData.selectedProject
                          ? ""
                          : e.target.value,
                    })
                  }
                  displayEmpty
                  style={{ height: "30px", fontSize: "12px" }}
                >
                  <MenuItem
                    disabled
                    value=""
                    style={{
                      fontSize: "12px",
                      padding: "4px 4px 4px 6px",
                      fontFamily: "Poppins",
                    }}
                  >
                    <em
                      style={{
                        height: "30px",
                        opacity: "0.75",
                        fontFamily: "Poppins",
                      }}
                    >
                      Select Project
                    </em>
                  </MenuItem>
                  {formData.projects.map((project) => (
                    <MenuItem
                      key={project.ProjectID}
                      value={project.ProjectID}
                      style={{ fontSize: "12px", padding: "4px 4px 4px 6px" }}
                    >
                      {project.ProjectName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl
                fullWidth
                className="formControl"
                style={{
                  flexBasis: "30%",
                  minWidth: "250px",
                  display: "flex",
                  marginLeft: "0rem", // Remove unnecessary left margin
                  marginRight: "0.3rem", // Add right margin to separate form controls
                }}
              >
                <Typography
                  className="subheader"
                  style={{ display: "inline", marginBottom: "0.5rem" }}
                >
                  Service Division <span className="required">*</span>
                </Typography>
                <Select
                  variant="outlined"
                  defaultValue=""
                  name="selectedServiceDivision"
                  value={formData.selectedServiceDivision}
                  onChange={handleChange}
                  displayEmpty
                  style={{ height: "30px", fontSize: "12px" }}
                >
                  <MenuItem
                    disabled
                    value=""
                    style={{ fontSize: "12px", padding: "4px 4px 4px 6px" }}
                  >
                    <em style={{ height: "30px", opacity: "0.75" }}>
                      Select Service Division
                    </em>
                  </MenuItem>
                  {formData.services.map((service) => (
                    <MenuItem
                      key={service.id}
                      value={service.id}
                      style={{ fontSize: "12px", padding: "4px 4px 4px 6px" }}
                    >
                      {service.service_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
       
          <Typography
            className="simpleHeading"
            style={{ fontWeight: "bold", marginBottom: "1rem" }}
          >
            Skill Details
          </Typography>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            marginBottom="1rem"
            gap={2}
          >
            <FormControl fullWidth className="formControl">
              <Typography
                className="subheader"
                noWrap
                style={{ display: "inline", marginBottom: "0.5rem" }}
              >
                {" "}
                Expected completion Timeline <span className="required">*</span>
              </Typography>
              <DatePicker
                className="text"
                value={formData.selectedDate}
                onChange={handleDateChange}
                renderInput={(params) => (
                  <TextField {...params} variant="outlined" />
                )}
              />
            </FormControl>
            <FormControl fullWidth className="formControl">
              <Typography
                className="subheader"
                noWrap
                style={{ display: "inline", marginBottom: "0.5rem" ,marginLeft:"0.2rem"}}
              >
                Request for - Tech Stack  / Competency
                <span className="required">*</span>
              </Typography>
              <Select
                variant="outlined"
                name="techStack"
                value={formData.selectedTechStack}
                onChange={handleTechStackChange}
                displayEmpty
                style={{
                  height: "30px",
                  width: "250px",
                  marginLeft: "6px",
                  fontSize: "12px",

                  fontStyle: "normal",
                }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300, // Adjust the max height of the dropdown menu
                      width: 100, // Adjust the width of the dropdown menu
                      fontSize: "12px", // Adjust font size inside the dropdown
                    },
                  },
                }}
              >
                <MenuItem
                  disabled
                  value=""
                  style={{ fontSize: "12px", padding: "4px 4px 4px 6px" }}
                >
                  <em style={{ height: "30px", opacity: "0.75" }}>
                    Select Tech Stack
                  </em>
                </MenuItem>
                {formData.techStacks.map((stack) => (
                  <MenuItem
                    key={stack.stack_id}
                    value={stack.stack_id}
                    style={{ fontSize: "12px", padding: "4px 4px 4px 6px" }}
                  >
                    {stack.stack_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth className="formControl">
              <Typography
                className="subheader"
                noWrap
                style={{ display: "inline", marginBottom: "0.5rem",marginLeft:"0.9rem" }}
              >
                Request for - Primary Skill
                <span className="required">*</span>
              </Typography>
              <Select
  variant="outlined"
  name="primarySkill"
  value={formData.selectedPrimarySkill}
  SelectDisplayProps={{ style: { fontSize: "12px" } }}
  onChange={(e) => {
    const selectedSkills = e.target.value;
    if (selectedSkills.length <= 3) {
      setFormData({
        ...formData,
        selectedPrimarySkill: selectedSkills,
      });
    }
  }}
  multiple // Allow multiple selections
  style={{ height: "30px", fontSize: "12px", opacity: 1 }}
>
  <MenuItem
    disabled
    value=""
    style={{ fontSize: "12px", padding: "4px 4px 4px 6px" }}
  >
    <em style={{ height: "30px", opacity: "0.75" }}>
      Select Maximum 3 Skills
    </em>
  </MenuItem>
  {formData.primarySkills.map((skill) => (
    <MenuItem
      key={skill.skill_id}
      value={skill.skill_id}
      style={{ fontSize: "12px", padding: "4px 4px 4px 6px" }}
    >
      {skill.skill_name}
    </MenuItem>
  ))}
</Select>

            </FormControl>
          </Box>
          <Typography
            className="simpleHeading"
            style={{ fontWeight: "bold", marginBottom: "0.5rem" }}
          >
            Employee Details
          </Typography>
          <FormControl
            component="fieldset"
            className="formControl"
            style={{ marginBottom: "0.5rem" }}
          >
            <RadioGroup
              row
              name="employeeDetails"
              value={formData.employeeDetails}
              onChange={handleChange}
            >
              <FormControlLabel
                value="add"
                control={<CustomRadio />}
                label={
                  <Typography
                    className="subheader"
                    style={{ marginLeft: "-6px" }}
                  >
                    Add Employees
                  </Typography>
                }
              />{" "}
              {role === "CapDev" && (
                <FormControlLabel
                  value="open"
                  control={<CustomRadio />}
                  label={
                    <Typography
                      className="subheader"
                      style={{ marginLeft: "-6px" }}
                    >
                      Place an Open Request
                    </Typography>
                  }
                />
              )}
            </RadioGroup>
          </FormControl>
          <Box style={{ width: "100%" }}>
           
              <Box display="flex" flexDirection="column" marginBottom="1rem">
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-between"
                  marginBottom="1rem"
                  gap={2}
                >
                  <FormControl fullWidth className="formControl">
  <Typography
    className="subheader"
    style={{ display: "inline", marginBottom: "0.5rem" }}
  >
    Select Employee <span className="required">*</span>
  </Typography>

  <Autocomplete
    options={searchResults}
    getOptionLabel={(option) => option.name || ""}
    onInputChange={handleEmployeeSearch}
    onChange={(event, value) => setSelectedEmployee(value)}
    renderInput={(params) => (
      <TextField
        {...params}
        variant="outlined"
        placeholder="Search Employees"
        style={{
          height: "20px",
          //  width: "250px", // Match the width of the Select component
          marginLeft: "2px",
          marginRight: "10px",
          fontSize: "12px",
          fontStyle: "normal",
        }}
        InputProps={{
          ...params.InputProps,
          style: { fontSize: "12.5px" },
        }}
        InputLabelProps={{
          style: { fontSize: "12px", opacity: "0.75" }, // Adjust placeholder text size and opacity
        }}
      />
    )}
    PaperComponent={(props) => (
      <Paper
        {...props}
        style={{
          maxHeight: 300, // Adjust the max height of the dropdown menu
          width: 250, // Match the width of the Select component
          fontSize: "12px", // Adjust font size inside the dropdown
        }}
      />
    )}
    renderOption={(props, option) => (
      <li
        {...props}
        style={{
          fontSize: "12px",
          padding: "4px 4px 4px 6px",
        }}
      >
        {option.name}
      </li>
    )}
  />
</FormControl>
                  <Typography
                    className="subheader"
                    align="center"
                    style={{
                      margin: " 30px",
                      marginLeft: "10px",
                      marginRight: "10px",
                    }}
                  >
                    OR
                  </Typography>
                  <FormControl fullWidth className="formControl">
                    <Typography
                      className="subheader"
                      style={{ display: "inline", marginBottom: "0.5rem" }}
                    >
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
                        style: { fontSize: "12.5px" },
                      }}
                    />
                  </FormControl>
                  <Box
                    marginTop="1.7rem"
                    display="flex"
                    justifyContent="flex-end"
                  >
                    <Button
                      className="btn"
                      variant="contained"
                      onClick={addEmployee}
                      sx={{
                        height: "31px",
                        fontSize: "21px",
                        fontWeight: "500",
                        minWidth: "64px",
                        backgroundColor: "white",
                        color: "#1C71FE",
                        boxShadow: "none",
                        border: "0.5px solid #1C71FE",
                      }}
                    >
                      +
                    </Button>
                  </Box>
                </Box>
                {formData.showTable && (
                  <TableContainer component={Paper} className="tableContainer">
                    <Table size="smaller">
                      <TableHead className="head">
                        <TableRow className="row" style={{ height: "10px" }}>
                          <TableCell className="tableHeader">
                            Employee ID
                          </TableCell>
                          <TableCell className="tableHeader">Name</TableCell>
                          <TableCell className="tableHeader">
                            Available From
                          </TableCell>
                          <TableCell className="tableHeader">
                            Daily Bandwidth
                          </TableCell>
                          <TableCell className="tableHeader">
                            Available on Weekend?
                          </TableCell>
                          <TableCell className="tableHeader">Actions</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell>
                            <TextField
                              className="availabledates"
                              type="date"
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  availableFrom: e.target.value,
                                })
                              }
                              sx={{
                                fontSize: "10px",
                                fontFamily: "Poppins",
                                letterSpacing: "-0.5px", // Reduce letter spacing
                                padding: "5px",
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Select
                              value={formData.updateAllBandwidth || ""}
                              style={{ fontSize: "12px" }}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  updateAllBandwidth: e.target.value,
                                })
                              }
                              size="small"
                              sx={{
                                // Apply Poppins font family
                                letterSpacing: "-0.5px", // Reduce letter spacing
                                padding: "5px", // Adjust padding inside Select component
                              }}
                            >
                              <MenuItem
                                value=""
                                sx={{ fontSize: "10px", fontFamily: "Poppins" }}
                              >
                                Select
                              </MenuItem>
                              <MenuItem
                                value="2 Hours"
                                sx={{ fontSize: "10px", fontFamily: "Poppins" }}
                              >
                                2 Hours
                              </MenuItem>
                              <MenuItem
                                value="4 Hours"
                                sx={{ fontSize: "10px", fontFamily: "Poppins" }}
                              >
                                4 Hours
                              </MenuItem>
                              <MenuItem
                                value="6 Hours"
                                sx={{ fontSize: "10px", fontFamily: "Poppins" }}
                              >
                                6 Hours
                              </MenuItem>
                              <MenuItem
                                value="Full Day"
                                sx={{ fontSize: "10px", fontFamily: "Poppins" }}
                              >
                                Full Day
                              </MenuItem>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <RadioGroup
                              row
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  updateAllWeekend: e.target.value,
                                })
                              }
                            >
                              <FormControlLabel
                                value="Yes"
                                control={<Radio size="small" />}
                                label="Yes"
                              />
                              <FormControlLabel
                                value="No"
                                control={<Radio size="small" />}
                                label="No"
                              />
                            </RadioGroup>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              style={{ textTransform: "none", padding: "5px" }}
                              onClick={() =>
                                updateAllEmployees({
                                  availableFrom: formData.availableFrom,
                                  bandwidth: formData.updateAllBandwidth,
                                  weekend: formData.updateAllWeekend,
                                })
                              }
                              size="small"
                            >
                              Update All
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {formData.employees
                          .slice(
                            formData.page * formData.rowsPerPage,
                            formData.page * formData.rowsPerPage +
                              formData.rowsPerPage
                          )
                          .map((employee) => (
                            <TableRow key={employee.uniqueKey}>
                              <TableCell>
                                <Box display="flex" alignItems="center" gap={1}>
                                  <Avatar src={employee.image} />
                                  {employee.id}
                                </Box>
                              </TableCell>
                              <TableCell>{employee.name}</TableCell>
                              <TableCell>
                                <TextField
                                  type="date"
                                  value={employee.availableFrom}
                                  onChange={(e) =>
                                    updateEmployee(
                                      employee.id,
                                      "availableFrom",
                                      e.target.value
                                    )
                                  }
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={employee.bandwidth}
                                  onChange={(e) =>
                                    updateEmployee(
                                      employee.id,
                                      "bandwidth",
                                      e.target.value
                                    )
                                  }
                                  size="small"
                                  sx={{
                                    fontSize: "10px", // Decrease font size
                                    fontFamily: "Poppins", // Apply Poppins font family
                                    letterSpacing: "-0.5px", // Reduce letter spacing
                                    padding: "5px", // Adjust padding inside Select component
                                  }}
                                >
                                  <MenuItem
                                    value=""
                                    sx={{
                                      fontSize: "10px",
                                      fontFamily: "Poppins",
                                    }}
                                  >
                                    Select
                                  </MenuItem>
                                  <MenuItem
                                    value="2 Hours"
                                    sx={{
                                      fontSize: "10px",
                                      fontFamily: "Poppins",
                                    }}
                                  >
                                    2 Hours
                                  </MenuItem>
                                  <MenuItem
                                    value="4 Hours"
                                    sx={{
                                      fontSize: "10px",
                                      fontFamily: "Poppins",
                                    }}
                                  >
                                    4 Hours
                                  </MenuItem>
                                  <MenuItem
                                    value="6 Hours"
                                    sx={{
                                      fontSize: "10px",
                                      fontFamily: "Poppins",
                                    }}
                                  >
                                    6 Hours
                                  </MenuItem>
                                  <MenuItem
                                    value="Full Day"
                                    sx={{
                                      fontSize: "10px",
                                      fontFamily: "Poppins",
                                    }}
                                  >
                                    Full Day
                                  </MenuItem>
                                </Select>
                              </TableCell>
                              <TableCell>
                                <RadioGroup
                                  row
                                  value={employee.weekend}
                                  onChange={(e) =>
                                    updateEmployee(
                                      employee.id,
                                      "weekend",
                                      e.target.value
                                    )
                                  }
                                >
                                  <FormControlLabel
                                    value="Yes"
                                    control={<Radio size="small" />}
                                    label="Yes"
                                  />
                                  <FormControlLabel
                                    value="No"
                                    control={<Radio size="small" />}
                                    label="No"
                                  />
                                </RadioGroup>
                              </TableCell>
                              <TableCell>
                                <IconButton
                                  color="error"
                                  onClick={() => removeEmployee(employee.id)}
                                  size="small"
                                >
                                  <CloseIcon />
                                </IconButton>
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
                      onPageChange={(e, newPage) =>
                        setFormData({ ...formData, page: newPage })
                      }
                      onRowsPerPageChange={(e) =>
                        setFormData({
                          ...formData,
                          rowsPerPage: parseInt(e.target.value, 10),
                          page: 0,
                        })
                      }
                    />
                  </TableContainer>
                )}
                {formData.showSummary && (
                  <Typography>
                    Total employees selected: {formData.employees.length}
                    {formData.invalidEmails.length > 0 && (
                      <span>
                        {" "}
                        (Invalid emails: {formData.invalidEmails.length})
                      </span>
                    )}
                  </Typography>
                )}
              </Box>
          
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="flex-start" // Adjust alignment to the start for better layout
            marginBottom="1rem"
            gap={2}
            flexWrap="nowrap"
          >
<FormControl
  fullWidth
  className="formControl"
  style={{ width: "30%" }}
>
  <Typography
    className="subheader"
    style={{ display: "inline", marginBottom: "0.5rem" }}
  >
    Provide other skills information{" "}
    <span className="required">*</span>
  </Typography>
  <Box style={{ height: "auto", width: "100%" }}>
    <ReactQuill
      value={formData.otherSkill}
      onChange={handleOtherSkillChange}
      modules={{
        toolbar: [["bold", "italic", "underline"]],
      }}
      placeholder="Other Skill Details should be less than 1000 words"
      style={{
        height: "200px", // Fixed height
        width: "100%", // Full width of container
        // overflowY: 'auto', // Enable vertical scrolling if content exceeds
      }}
    />
  </Box>
</FormControl>
<FormControl
  fullWidth
  className="formControl"
  style={{ width: "30%" }}
>
  <Typography
    className="subheader"
    style={{ display: "inline", marginBottom: "0.5rem" }}
  >
    Suggest completion criteria <span className="required">*</span>
  </Typography>

  <Box style={{ height: "auto", width: "100%" }}>
    <ReactQuill
      value={formData.completionCriteria}
      onChange={handleCompletionCriteriaChange}
      modules={{
        toolbar: [["bold", "italic", "underline"]],
      }}
      placeholder="Suggest Completion criteria should be less than 1000 words"
      style={{
        height: "200px",
        width: "100%",
        // overflowY: 'auto', // Add scroll if content exceeds
      }}
    />
  </Box>
</FormControl>
            <FormControl
              fullWidth
              className="formControl"
              style={{ width: "30%" }}
            >
              <Typography
                className="subheader"
                style={{ display: "inline", marginBottom: "0.5rem" }}
              >
                Comments
              </Typography>
              <Box style={{ height: "auto", width: "100%" }}>
                <ReactQuill
                  value={formData.comment}
                  onChange={(value) =>
                    setFormData({ ...formData, comment: value })
                  }
                  modules={{
                    toolbar: [["bold", "italic", "underline"]],
                  }}
                  placeholder="Comments should be less than 350 words"
                  style={{
                    height: "200px",
                    width: "100%",
                    // overflowY: 'auto', // Enable scroll if content exceeds
                  }}
                />
              </Box>
            </FormControl>
          </Box>
          <Box className="buttonGroup  ButtonBox">
            <Button
              variant="outlined"
              style={{
                minWidth: "12px",
                textTransform: "none",
                color: "#1C71FE",
                boxShadow: "none",
                border: "none",
              }}
              onClick={() => navigate("/training-container")} // Add this line
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              style={{
                minWidth: "120px",
                textTransform: "none",
                borderRadius: "10px ",
                backgroundColor: isFormValid ? "#066DD2" : "#BFBFBF", // Change color based on validity
                boxShadow: "none",
                color: isFormValid ? "white" : "#8c8c8c", // Change text color based on validity
              }}
              onClick={handleSubmit}
              disabled={!isFormValid}
            >
              Submit
            </Button>
          </Box>
        </Paper>
      </Paper>

      {/* <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>  */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          style: {
            padding: "10px",
            borderRadius: "8px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <DialogTitle
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontSize: "24px",
          }}
        >
          <CheckCircleIcon
            style={{ color: "green", fontSize: "3rem", marginBottom: "10px" }}
          />
          Request generated successfully with  request number : 
          <strong style={{ fontSize: "18px", color: "#333" }}>
            {newRequestId}
          </strong>
          .
          <IconButton
            onClick={handleCloseDialog}
            style={{
              position: "absolute",
              right: "10px",
              top: "10px",
              padding: "0",
            }}
          >
            <CloseIcon style={{ fontSize: "1.5rem" }} />
          </IconButton>
        </DialogTitle>
      </Dialog>
    </LocalizationProvider>
  );
};
export default NewTrainingRequest;
