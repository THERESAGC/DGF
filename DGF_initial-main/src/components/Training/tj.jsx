import { useState } from "react"
import Autocomplete from "@mui/material/Autocomplete"
import TextField from "@mui/material/TextField"
import Paper from "@mui/material/Paper"
import Avatar from "@mui/material/Avatar"
import { arrayBufferToBase64 } from "../../utils/helper"
 
const NewTrainingRequest = ({
  formData,
  setFormData,
  isFormValid,
  setIsFormValid,
  handleFormChange,
  selectedEmployee,
  setSelectedEmployee,
  handleEmailSearch,
  setSnackbarMessage,
  setSnackbarSeverity,
  setSnackbarOpen,
  validateForm, // Added validateForm prop
}) => {
  const [searchResults, setSearchResults] = useState([])
 
  const handleEmployeeSearch = (event, value) => {
    if (value.length > 0) {
      let apiUrl
      if (formData.employeeDetails === "add" && formData.requestonbehalfRole !== 4) {
apiUrl = `http://localhost:8000/api/employeeSearchByName/searchEmployeesByName?managerId=${formData.requestonbehalf}&name=${value}`
      } else {
apiUrl = `http://localhost:8000/api/employees/searchWithoutManager?name=${value}`
      }
 
      fetch(apiUrl)
        .then((response) => response.json())
        .then(async (data) => {
          if (Array.isArray(data)) {
            const employeesWithSkills = await Promise.all(
data.map(async (emp) => {
                try {
                  let learnerResponse
                  let learnerData
 
                  if (formData.employeeDetails === "open") {
                    learnerResponse = await fetch(
`http://localhost:8000/api/orgLevelLearners/getOrgLevelLearnerData/${emp.emp_id}`,
                    )
                    learnerData = await learnerResponse.json()
                    return {
                      ...emp,
                      totalPrimarySkills: learnerData.total_requests || 0,
                    }
                  } else {
learnerResponse = await fetch(`http://localhost:8000/api/learners/getLearners/${emp.emp_id}`)
                    learnerData = await learnerResponse.json()
                    return {
                      ...emp,
                      totalPrimarySkills: learnerData.total_primary_skills || 0,
                    }
                  }
                } catch (error) {
                  console.error("Error fetching learner data:", error)
                  return { ...emp, totalPrimarySkills: 0 }
                }
              }),
            )
            setSearchResults(
employeesWithSkills.map((emp) => ({
                id: emp.emp_id,
                name: emp.emp_name,
                email: emp.emp_email,
profileImage: `data:image/jpeg;base64,${arrayBufferToBase64(emp.profile_image.data)}`,
uniqueKey: `${emp.emp_id}-${Date.now()}`,
                totalPrimarySkills: emp.totalPrimarySkills,
              })),
            )
          }
        })
        .catch((error) => console.error("Error fetching employees:", error))
    }
  }
 
  const addEmployee = async () => {
    const newEmployees = []
    const invalidEmails = []
 
    // Add selected employee from "Select Employee" field
if (selectedEmployee && !formData.employees.some((emp) => emp.id === selectedEmployee.id)) {
      try {
        let response
        let data
 
        if (formData.employeeDetails === "open") {
          response = await fetch(
`http://localhost:8000/api/orgLevelLearners/getOrgLevelLearnerData/${selectedEmployee.id}`,
          )
        } else {
response = await fetch(`http://localhost:8000/api/learners/getLearners/${selectedEmployee.id}`)
        }
 
        data = await response.json()
 
        newEmployees.push({
          ...selectedEmployee,
          availableFrom: "",
          bandwidth: "",
          weekend: "",
          total_requests: data.total_requests || 0,
          requests: data.requests || [],
        })
      } catch (error) {
        console.error("Error fetching employee requests:", error)
        newEmployees.push(selectedEmployee)
      }
      setSelectedEmployee(null)
    }
 
    // Process comma-separated emails
    if (formData.emails.trim() !== "") {
      const emailList = formData.emails.split(",").map((email) => email.trim())
      const uniqueEmails = [...new Set(emailList)] // Remove duplicate emails
 
      for (const email of uniqueEmails) {
        const employee = await handleEmailSearch(email)
        if (employee) {
          try {
            let response
            let data
 
            if (formData.employeeDetails === "open") {
response = await fetch(`http://localhost:8000/api/orgLevelLearners/getOrgLevelLearnerData/${employee.id}`)
            } else {
response = await fetch(`http://localhost:8000/api/learners/getLearners/${employee.id}`)
            }
 
            data = await response.json()
 
            newEmployees.push({
              ...employee,
              availableFrom: "",
              bandwidth: "",
              weekend: "",
              total_requests: data.total_requests || 0,
              requests: data.requests || [],
            })
          } catch (error) {
            console.error("Error fetching employee requests:", error)
            newEmployees.push(employee)
          }
        } else {
          invalidEmails.push(email)
        }
      }
      if (invalidEmails.length > 0) {
        setSnackbarMessage(`Invalid emails: ${invalidEmails.join(", ")}`)
        setSnackbarSeverity("error")
        setSnackbarOpen(true)
      }
    }
 
    setFormData((prev) => ({
      ...prev,
      employees: [...prev.employees, ...newEmployees],
      showTable: newEmployees.length > 0,
      showSummary: true,
      emails: "",
    }))
    setIsFormValid(validateForm()) // Using validateForm
  }
 
  return (
    <Autocomplete
      options={searchResults}
getOptionLabel={(option) => option.name || ""}
      getOptionDisabled={(option) =>
        formData.employeeDetails === "open" ? option.totalPrimarySkills >= 1 : option.totalPrimarySkills >= 3
      }
      onInputChange={handleEmployeeSearch}
      onChange={(event, value) => {
        if (
          value &&
          ((formData.employeeDetails === "open" && value.totalPrimarySkills < 1) ||
            (formData.employeeDetails === "add" && value.totalPrimarySkills < 3))
        ) {
          setSelectedEmployee(value)
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          placeholder="Search Employees"
          helperText={
            formData.employeeDetails === "open"
              ? "Employees with ongoing learning cannot be selected"
              : "Employees with 3+ ongoing learnings cannot be selected"
          }
          InputProps={{
            ...params.InputProps,
            style: { fontSize: "12.5px" },
          }}
        />
      )}
      renderOption={(props, option) => (
        <li
          {...props}
          style={{
            opacity:
              (formData.employeeDetails === "open" && option.totalPrimarySkills >= 1) ||
              (formData.employeeDetails === "add" && option.totalPrimarySkills >= 3)
                ? 0.5
                : 1,
            pointerEvents:
              (formData.employeeDetails === "open" && option.totalPrimarySkills >= 1) ||
              (formData.employeeDetails === "add" && option.totalPrimarySkills >= 3)
                ? "none"
                : "auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px",
            fontSize: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Avatar src={option.profileImage} style={{ width: 24, height: 24 }} />
{option.name}</div>
       
 
          {option.totalPrimarySkills > 0 && (
            <span
              style={{
                backgroundColor:
                  (formData.employeeDetails === "open" && option.totalPrimarySkills >= 1) ||
                  (formData.employeeDetails === "add" && option.totalPrimarySkills >= 3)
                    ? "#ffebee"
                    : option.totalPrimarySkills === 1
                      ? "#fbfbd3"
                      : "#fbfbd3",
                borderRadius: "12px",
                padding: "4px 8px",
                fontSize: "10px",
                color:
                  (formData.employeeDetails === "open" && option.totalPrimarySkills >= 1) ||
                  (formData.employeeDetails === "add" && option.totalPrimarySkills >= 3)
                    ? "#c62828"
                    : "#000000",
              }}
            >
              {option.totalPrimarySkills} {option.totalPrimarySkills === 1 ? "learning" : "learnings"}
            </span>
          )}
        </li>
      )}
      PaperComponent={(props) => (
        <Paper
          {...props}
          style={{
            maxHeight: 300,
            fontSize: "12px",
          }}
        />
      )}
    />
  )
}
 
export default NewTrainingRequest