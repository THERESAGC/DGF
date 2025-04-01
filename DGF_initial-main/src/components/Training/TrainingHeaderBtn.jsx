
import { useState, useContext, useEffect } from "react"
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material"
import { useNavigate, useLocation } from "react-router-dom"
import AuthContext from "../Auth/AuthContext"
import "../Training/TrainingHeaderBtn.css"

const TrainingHeaderBtn = () => {
  const [selectedButton, setSelectedButton] = useState("My Learning Requests")
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useContext(AuthContext)

  useEffect(() => {
    // Set selected button based on current path
    if (location.pathname === "/reminders") {
      setSelectedButton("Reminders")
    } else if (location.pathname === "/training-container") {
      setSelectedButton("My Learning Requests")
    }
  }, [location.pathname])

  const handleButtonClick = (button, path) => {
    setSelectedButton(button)
    navigate(path)
  }

  return (
    <AppBar position="static" className="appBar">
      <Toolbar className="toolbar">
        <Box className="box">
          {[
            { text: "My Learning Requests", path: "/training-container" },
            { text: "Reminders", path: "/reminders" },
          ].map((item) => (
            <Typography
              key={item.text}
              variant="h6"
              component="div"
              className={`typography ${selectedButton === item.text ? "selected" : ""}`}
              onClick={() => handleButtonClick(item.text, item.path)}
            >
              {item.text}
            </Typography>
          ))}
        </Box>
        <Box className="box">
          {user.role_id !== 10 && (
            <Button variant="contained" color="primary" className="button" onClick={() => navigate("/new-request")}> 
              New Request
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default TrainingHeaderBtn



