
import { Paper, Typography, Grid, Divider, Box, FormControl, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Avatar, Autocomplete, TextField, Button } from "@mui/material";
import { useState } from "react";
import IconButton from '@mui/material/IconButton'; // Correct import for IconButton
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CloseIcon from '@mui/icons-material/Close';
import './ClarificationRequested.css';


const ClarificationRequested = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [employees, setEmployees] = useState([]); // State to manage employees
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({
    employees: [],
    emails: "",
  });

  const handleEmployeeSearch = (event, value) => {
    if (value.length > 0) {
      fetch(`http://localhost:8000/api/employee/search?name=${value}`)
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

  
    setFormData((prevFormData) => ({
      ...prevFormData,
      employees: [...prevFormData.employees, ...newEmployees],
      showTable: true,
      showSummary: true,
      emails: "", // Clear the email input field
      invalidEmails: invalidEmails, // Store invalid emails
    }));
    setEmployees((prevEmployees) => [...prevEmployees, ...newEmployees]); // Update employees state
  };

  const removeEmployee = (id) => {
    setFormData({
      ...formData,
      employees: formData.employees.filter((emp) => emp.id !== id),
    });
    setEmployees((prevEmployees) => prevEmployees.filter((emp) => emp.id !== id)); // Update employees state
  };

  const updateEmployee = (id, field, value) => {
    setFormData({
      ...formData,
      employees: formData.employees.map((emp) =>
        emp.id === id ? { ...emp, [field]: value } : emp
      ),
    });
    setEmployees((prevEmployees) =>
      prevEmployees.map((emp) =>
        emp.id === id ? { ...emp, [field]: value } : emp
      )
    ); // Update employees state
  };


  const employeeDatabase = {
    "jonathan.hart@example.com": {
      id: "HS158",
      name: "Jonathan Hart",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      training: {
        reqNo: "#231",
        project: "Staffing Nation",
        objective: "Upskilling",
        techStack: "React",
        requestedOn: "Jan 20, 2025",
      },
    },
    "mike.clark@example.com": {
      id: "HS305",
      name: "Mike Clark",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    "alan.patel@example.com": {
      id: "HS97",
      name: "Alan Patel",
      image: "https://randomuser.me/api/portraits/men/3.jpg",
    },
    "joe.estrada@example.com": {
      id: "HS391",
      name: "Joe Estrada",
      image: "https://randomuser.me/api/portraits/men/4.jpg",
    },
    "janet.powell@example.com": {
      id: "HS467",
      name: "Janet Powell",
      image: "https://randomuser.me/api/portraits/women/5.jpg",
    },
  };
// Convert object to array
const employees1 = Object.values(employeeDatabase);
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
    style={{ fontWeight: "600", fontSize: "14px", marginLeft: "10rem" }}
  >
    Learning Request
  </Typography>
</Box>
        <Box
  style={{
    backgroundColor: "#FCFBDA",
    borderRadius: "10px",
    marginBottom: "-1rem",
  }}
>
  <Typography variant="body1" style={{ fontWeight: "600" ,borderRadius: "40px",margin:"0.4rem" }}>
    Clarification Requested
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
                  <Typography className="typography-value-upper">#1234</Typography>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className="form-control">
                  <Typography className="typography-label-upper">Request By:</Typography>
                  <Typography className="typography-value-upper">Joe Maison</Typography>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className="form-control">
                  <Typography className="typography-label-upper">Project:</Typography>
                  <Typography className="typography-value-upper">#Wallmart</Typography>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className="form-control">
                  <Typography className="typography-label-upper">Service Division:</Typography>
                  <Typography className="typography-value-upper">Tech Services</Typography>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className="form-control">
                  <Typography className="typography-label-upper">Expected Completion:</Typography>
                  <Typography className="typography-value-upper">31st Jan 2025</Typography>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className="form-control">
                  <Typography className="typography-label-upper">Techstack / Area:</Typography>
                  <Typography className="typography-value-upper">Front-end</Typography>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={2} style={{ marginTop: "1rem" }}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className="form-control">
                  <Typography className="typography-label-upper">Primary Skills / Competencies:</Typography>
                  <Typography className="typography-value-upper">Programming Knowledge</Typography>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          <Divider className="divider" style={{ marginTop: "1rem", marginBottom: "1rem" }} />
          <Box>
            <Grid container spacing={2} style={{ marginTop: "0.5rem" }}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className="form-control">
                  <Typography className="typography-label-upper">Other Skill Information in Details:</Typography>
                  <Typography className="typography-value-upper">Tech Services</Typography>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className="form-control">
                  <Typography className="typography-label-upper">Completion Criteria:</Typography>
                  <Typography className="typography-value-upper">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  </Typography>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={2} style={{ padding: "10px", marginTop: "1rem" }}>
              <Grid item xs={12}>
                <FormControl fullWidth className="form-control">
                  <Typography className="typography-label-upper">Comments:</Typography>
                  <Typography className="typography-value-upper"  >
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Blanditiis ab assumenda aliquam reprehenderit, ratione quaerat consequuntur quod odit rerum hic nulla dignissimos accusantium saepe veniam a velit, repudiandae eius debitis quidem magnam commodi animi? Dolore, distinctio excepturi maxime totam, adipisci quas reprehenderit sint praesentium sit non alias fugit eum quisquam!
                  </Typography>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          <Divider className="divider" style={{ marginTop: "1rem", marginBottom: "1rem" }} />
          <Box>
            <div style={{ maxWidth: "100%", margin: "auto", padding: 20 }}>
              <h2 style={{ fontSize: "12px", marginBottom: "1rem" }}>
                {employees.length} Learners are allocated to this learning request
              </h2>
            
  <Typography
    className="subheader"
    style={{ display: "inline", marginBottom: "0.5rem" }}
  >
    Select Employee <span className="required">*</span>
  </Typography>

  <Box display="flex" alignItems="center">
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
        marginLeft: "2px",
        marginRight: "10px",
        fontSize: "12px",
        fontStyle: "normal",
        width: "300px", // Adjust the width here
      }}
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
    <Paper
      {...props}
      style={{
        maxHeight: 300,
        width: 300, // Adjust the width here
        fontSize: "12px",
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
      marginLeft: "10px", // Add some space between the Autocomplete and Button
    }}
  >
    +
  </Button>
</Box>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Employee ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Available From</TableCell>
                      <TableCell>Daily Bandwidth</TableCell>
                      <TableCell>Available on Weekend?</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {employees.map((employees1) => (
                      <TableRow key={employees1.id}>
                        <TableCell>{employees1.id}</TableCell>
                        <TableCell>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <Avatar src={employees1.image} alt={employees1.name} />
                            <div style={{ marginLeft: 10 }}>
                              <Typography>{employees1.name}</Typography>
                              {employees1.training && (
                                <Typography
                                  variant="caption"
                                  style={{
                                    backgroundColor: "#ffff99",
                                    padding: "3px 6px",
                                    borderRadius: "5px",
                                    display: "inline-block",
                                    marginTop: "5px",
                                  }}
                                >
                                  ✅ {employees1.training.reqNo} Training in Progress
                                </Typography>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>15th Jan, 2025</TableCell>
                        <TableCell>4hrs</TableCell>
                        <TableCell>No</TableCell>
                        <TableCell>
                          <IconButton color="error" onClick={() => removeEmployee(employee.id)}>
                            <CloseIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </Box>
        </div>
      </Paper>
    </>
  );
};

export default ClarificationRequested;
