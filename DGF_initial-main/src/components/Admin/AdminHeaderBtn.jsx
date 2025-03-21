
import { useState, useContext } from "react"
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material"
import { useNavigate } from "react-router-dom"
import AuthContext from "../Auth/AuthContext"
import AddUserModal from "./AddUserModal"
import "./AdminHeaderBtn.css"
import DownloadReport from "../Training/DownloadReport"
const AdminHeaderBtn = ({ onSelectComponent }) => {
  const [selectedButton, setSelectedButton] = useState("User Management")
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  const handleButtonClick = (button) => {
    setSelectedButton(button)
    onSelectComponent(button)
  }

  const handleOpenUserModal = () => {
    setIsUserModalOpen(true)
  }

  const handleCloseUserModal = () => {
    setIsUserModalOpen(false)
  }


  // Handle download report - Excel format
          const handleDownloadReport = (startDate, endDate) => {
            console.log("Downloading Excel report for date range:", startDate, "to", endDate)
   
            // Filter requests based on date range
            const filteredByDate = requests.filter((request) => {
              const requestDate = new Date(request.createddate)
              return requestDate >= startDate && requestDate <= endDate
            })
   
            // Prepare data for Excel export
            const excelData = filteredByDate.map((row) => ({
              "Request ID": row.requestid,
              Project: row.newprospectname || row.project_name || "N/A",
              Objective: row.trainingobj_name || "No Objective",
              "Tech Stack": row.techstack_name || "No Tech Stack",
              "Created Date": formatDate(row.createddate) || "No Date",
              Status: row.requeststatus || "N/A",
              "Assigned To": row.assignedto_name || "Not Assigned",
              "Learners Count": learnersData[row.requestid]?.totalLearners || 0,
              Completed: completionStatus[row.requestid]?.completedEmployees || 0,
              "Total Employees": completionStatus[row.requestid]?.totalEmployees || 0,
            }))
   
            // Create a worksheet
            const worksheet = XLSX.utils.json_to_sheet(excelData)
   
            // Create a workbook
            const workbook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workbook, worksheet, "Training Requests")
   
            // Generate Excel file
            const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
   
            // Save to file
            const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
   
            // Create download link
            const fileName = `training_requests_${formatDate(startDate)}_to_${formatDate(endDate)}.xlsx`
   
            // Create a download link and trigger the download
            const url = window.URL.createObjectURL(data)
            const link = document.createElement("a")
            link.href = url
            link.download = fileName
            link.click()
   
            // Clean up
            setTimeout(() => {
              window.URL.revokeObjectURL(url)
            }, 100)
          }
   
          
          return (
            <>
              <AppBar position="static" className="AdminBar">
                <Toolbar className="toolbar">
                  <Box className="admin">
                    {[
                      { text: "User Management", path: "/admin-container" },
                      { text: "Data Field Management", path: "" },
                      { text: "Download", path: "/download-report" },
                    ].map((item) => (
                      <Typography
                        key={item.text}
                        variant="h6"
                        component="div"
                        className={`typography ${selectedButton === item.text ? "selected" : ""}`}
                        onClick={() => {
                          handleButtonClick(item.text)
                          if (item.path) {
                            navigate(item.path)
                          }
                        }}
                        sx={{
                          color: selectedButton === item.text ? "blue" : "black",
                          cursor: "pointer",
                        }}
                      >
                        {item.text}
                      </Typography>
                    ))}
                  </Box>
                  {selectedButton !== "Data Field Management" && (
                    <Box className="admin">
                      <Button
                        variant="contained"
                        color="primary"
                        className="button"
                        onClick={handleOpenUserModal}
                        disabled={user.role_id === 10}
                      >
                        Add New User
                      </Button>
                    </Box>
                  )}
                </Toolbar>
              </AppBar>
              <AddUserModal open={isUserModalOpen} onClose={handleCloseUserModal} />
            </>
          )
          
}

export default AdminHeaderBtn

