import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  Paper,
  Grid,
  Button,
  Avatar,
  Modal,
  TextField,
  Autocomplete,
} from "@mui/material"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import axios from "axios"

const AddUserModal = ({ open, onClose }) => {
  const [role, setRole] = useState("")
  const [employee, setEmployee] = useState("")
  const [roles, setRoles] = useState([])
  const [userRole, setUserRole] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [employees, setEmployees] = useState([])
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/getallroles/getAllRoles")
        setRoles(response.data)
      } catch (error) {
        console.error("Error fetching roles:", error)
      }
    }
    fetchRoles()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const fetchEmployees = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8000/api/employees/searchWithoutManager?name=${searchTerm}`,
          )
          setEmployees(response.data)
        } catch (error) {
          console.error("Error fetching employees:", error)
        }
      }
      fetchEmployees()
    }
  }, [searchTerm])

  const handleRoleChange = (event) => {
    setRole(event.target.value)
  }

  const handleEmployeeChange = (event, value) => {
    setEmployee(value ? value.emp_id : "")
    setSelectedEmployee(value)
  }

  const handleUserRoleChange = (event) => {
    setUserRole(event.target.value)
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleSaveUser = async () => {
    if (!selectedEmployee || !role || (role === "User" && !userRole)) {
      alert("Please fill all required fields.")
      return
    }

    const roleData = roles.find((r) => r.role_name === (role === "User" ? userRole : role))

    if (!roleData) {
      alert("Invalid role selection")
      return
    }

    const newUserData = {
      emp_id: selectedEmployee.emp_id,
      name: selectedEmployee.emp_name,
      email: selectedEmployee.emp_email,
      password: "defaultPassword",
      designation: selectedEmployee.Designation_Name,
      role_id: roleData.role_id,
      profile_image: selectedEmployee.profile_image,
      created_on: new Date().toISOString().slice(0, 19).replace("T", " "),
      status: "invited",
    }

    try {
      // First, add the user
      const addUserResponse = await axios.post("http://localhost:8000/api/addUser", newUserData)
      alert("User added successfully")

      // Then, request password change
      const { email } = newUserData // Assuming newUserData contains the email
      const passwordChangeResponse = await axios.post("http://localhost:8000/api/request-password-change", { email })

      if (passwordChangeResponse.status === 200) {
        alert("Password change request sent successfully")
      } else {
        alert("Failed to request password change")
      }

      // Close the modal after successful completion
      onClose()
    } catch (error) {
      console.error("Error:", error)

      // Handle the error by showing the appropriate message
      alert(error.response?.data?.message || "An error occurred")
    }
  }

  const capDevRole = roles.find((role) => role.role_name === "CapDev Role")
  const spocRole = roles.find((role) => role.role_name === "SPOC")
  const rmRole = roles.find((role) => role.role_name === "RM Role")
  const userRoles = roles.filter(
    (role) => role.role_name !== "CapDev Role" && role.role_name !== "SPOC" && role.role_name !== "RM Role",
  )

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            maxWidth: 600,
            p: "13px 17px 13px 15px",
            mx: "auto",
            mt: 2,
            bgcolor: "background.paper",
            borderRadius: 1,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 500, mb: 3 }}>
            Add User
          </Typography>

          <Box sx={{ border: "1px solid #e0e0e0", borderRadius: 1, p: 3, bgcolor: "#FCFCFC" }}>
            <FormControl component="fieldset" sx={{ width: "100%", mb: 3 }}>
              <FormLabel
                component="legend"
                required
                sx={{
                  color: "black",
                  fontSize: "0.875rem",
                  mb: 1,
                }}
              >
                Select Role
              </FormLabel>
              <RadioGroup row name="role-radio-group" value={role} onChange={handleRoleChange}>
                {capDevRole && (
                  <FormControlLabel
                    value={capDevRole.role_name}
                    control={<Radio size="small" color="" />}
                    label={capDevRole.role_name}
                    sx={{ mr: 3 }}
                  />
                )}
                {spocRole && (
                  <FormControlLabel
                    value={spocRole.role_name}
                    control={<Radio size="small" color="" />}
                    label={spocRole.role_name}
                    sx={{ mr: 3 }}
                  />
                )}
                {rmRole && (
                  <FormControlLabel
                    value={rmRole.role_name}
                    control={<Radio size="small" color="" />}
                    label={rmRole.role_name}
                    sx={{ mr: 3 }}
                  />
                )}
                <FormControlLabel value="User" control={<Radio size="small" color="" />} label="User" sx={{ mr: 3 }} />
              </RadioGroup>
            </FormControl>

            {role === "User" && (
              <FormControl fullWidth sx={{ mb: 1.5 }}>
                <FormLabel
                  component="legend"
                  required
                  sx={{
                    color: "black",
                    fontSize: "0.875rem",
                    mb: 0.5,
                  }}
                >
                  Select User Group
                </FormLabel>
                <Select
                  value={userRole}
                  onChange={handleUserRoleChange}
                  displayEmpty
                  IconComponent={KeyboardArrowDownIcon}
                  renderValue={(selected) => (
                    <Box
                      sx={{
                        display: "flex",
                        fontSize: "12px",
                        color: selected ? "black" : "#BDBDBD",
                        alignItems: "center",
                      }}
                    >
                      {selected || "Select User Role"}
                    </Box>
                  )}
                  sx={{
                    height: "30px",
                    ".MuiOutlinedInput-notchedOutline": {
                      borderColor: "#e0e0e0",
                      fontSize: "10px",
                    },
                  }}
                >
                  {userRoles.map((role) => (
                    <MenuItem key={role.role_id} value={role.role_name}>
                      {role.role_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <FormControl fullWidth sx={{ mb: 1 }}>
              <FormLabel
                component="legend"
                required
                sx={{
                  color: "black",
                  fontSize: "0.875rem",
                  mb: 0.5,
                }}
              >
                Search Employee
              </FormLabel>
              <Autocomplete
                options={employees}
                getOptionLabel={(option) => option.emp_name}
                onInputChange={handleSearchChange}
                onChange={handleEmployeeChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search by name"
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{
                      mb: 1,
                      "& .MuiOutlinedInput-root": {
                        fontSize: "12px", // You can adjust this value
                        marginTop: "3px !important", // You can adjust this value
                        height: "30px !important", // You can adjust this value
                      },
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props} key={option.emp_id}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        src={option.profile_image || "/placeholder.svg?height=30&width=30"}
                        alt={option.emp_name}
                        sx={{ width: 24, height: 24, mr: 1 }}
                      />
                      {option.emp_name}
                    </Box>
                  </li>
                )}
              />
            </FormControl>

            <Paper
              elevation={0}
              sx={{
                backgroundColor: "#f9f9f9",
                p: 3,
                borderRadius: 1,
                mb: 3,
                minHeight: 100,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {selectedEmployee ? (
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Employee ID
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {selectedEmployee.emp_id}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Designation
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {selectedEmployee.Designation_Name || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Email
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {selectedEmployee.emp_email}
                    </Typography>
                  </Grid>
                </Grid>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Selected employee details will be shown here
                </Typography>
              )}
            </Paper>

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
              <Button
                variant="text"
                sx={{
                  color: "#1976d2",
                  textTransform: "none",
                  fontWeight: 400,
                }}
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#1976d2",
                  textTransform: "none",
                  minWidth: 80,
                  boxShadow: "none",
                }}
                onClick={handleSaveUser}
              >
                Add
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  )
}

export default AddUserModal

