import { useState, useContext } from "react"
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material"
import { useNavigate } from "react-router-dom"
import AuthContext from "../Auth/AuthContext"
import AddUserModal from "./AddUserModal"
import "./AdminHeaderBtn.css"

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
           
          return (
            <>
              <AppBar position="static" className="AdminBar">
                <Toolbar className="toolbar">
                  <Box className="admin">
                    {[
                      { text: "User Management", path: "/admin-container" },
                      { text: "Data Field Management", path: "" },
                      { text: "Reports Management", path: "/admin-container" },
                    ].map((item) => (
                      <Typography
                        key={item.text}
                        variant="h6"
                        component="div"
                        className={`typograph ${selectedButton === item.text ? "selected" : ""}`}
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
                  {selectedButton !== "Data Field Management" && selectedButton !== "Reports Management" && (
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

