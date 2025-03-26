import { useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { TextField, Button, Box, Typography, Paper, InputLabel } from "@mui/material"
import axios from "axios"
import AuthContext from "./AuthContext"
import logo from "../../assets/harbinger-logo.svg"
import backgroundImage from "../../assets/Onelogin-BG 1.jpg" // Import the background image
 
const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailError, setEmailError] = useState("")
  const [isFormValid, setIsFormValid] = useState(false)
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)
 
  // Validate form on input change
  useEffect(() => {
    validateForm()
  }, [email, password])
 
  const validateEmail = (email) => {
    if (!email) return false
 
    const isValidFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    const hasValidDomain = email.endsWith("harbingergroup.com")
 
    if (!isValidFormat) {
      setEmailError("Please enter a valid email address")
      return false
    } else if (!hasValidDomain) {
      setEmailError("Email must be from harbingergroup.com")
      return false
    } else {
      setEmailError("")
      return true
    }
  }
 
  const validateForm = () => {
    const isEmailValid = validateEmail(email)
    const isPasswordValid = password.length > 0
    setIsFormValid(isEmailValid && isPasswordValid)
  }
 
  const handleLogin = async () => {
    if (!isFormValid) return
 
    try {
      const response = await axios.post("http://localhost:8000/api/auth/login", {
        email,
        password,
      })
 
      if (response.data.message === "Login successful") {
        login(response.data.user)
        navigate("/dashboardgraph")
      } else {
        alert("Login failed")
      }
    } catch (error) {
      console.error("Login error:", error)
      alert("Login failed")
    }
  }
 
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100%",
        backgroundImage: `url(${backgroundImage})`, // Set the background image
        backgroundSize: "cover", // Ensure the image covers the entire background
        backgroundPosition: "center", // Center the background image
      }}
    >
      <Paper
        elevation={5}
        sx={{
          padding: "30px",
          width: "100%",
          maxWidth: "450px",
          backgroundColor: "#ffffff",
          borderRadius: "4px",
          boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 4,
            borderBottom: "1px solid #eaeaea",
            paddingBottom: 3,
          }}
        >
          <img
            src={logo || "/placeholder.svg"}
            alt="Harbinger Group Logo"
            style={{
              height: "50px",
              marginBottom: "10px",
            }}
          />
        </Box>
 
        <Box sx={{ mb: 3 }}>
          <InputLabel
            htmlFor="email"
            sx={{
              color: "#666",
              fontSize: "14px",
              mb: 1,
              fontWeight: 400,
            }}
          >
            Username
          </InputLabel>
          <TextField
            id="email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@harbingergroup.com"
            error={!!emailError}
            helperText={emailError}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#e0e0e0",
                },
                "&:hover fieldset": {
                  borderColor: "#bdbdbd",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#0288d1",
                },
                "& .MuiOutlinedInput-input": {
                  padding: "10px 14px", // Reduced padding
                },
                "& input:-webkit-autofill": {
                  transition: "background-color 5000s ease-in-out 0s", // Prevents autofill background color
                  },
 
              },
            }}
            InputProps={{
              sx: { borderRadius: 1 },
            }}
          />
        </Box>
 
        <Box sx={{ mb: 4 }}>
          <InputLabel
            htmlFor="password"
            sx={{
              color: "#666",
              fontSize: "14px",
              mb: 1,
              fontWeight: 400,
            }}
          >
            Password
          </InputLabel>
          <TextField
            id="password"
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#e0e0e0",
                },
                "&:hover fieldset": {
                  borderColor: "#bdbdbd",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#0288d1",
                },
                "& .MuiOutlinedInput-input": {
                  padding: "10px 14px", // Reduced padding
                },
              },
            }}
            InputProps={{
              sx: { borderRadius: 1 },
            }}
          />
        </Box>
 
        <Button
          fullWidth
          variant="contained"
          onClick={handleLogin}
          disabled={!isFormValid}
          sx={{
            backgroundColor: "#0288d1",
            color: "white",
            textTransform: "none",
            fontSize: "16px",
            padding: "10px 0",
            "&:hover": {
              backgroundColor: "#0277bd",
            },
            "&.Mui-disabled": {
              backgroundColor: "#e0e0e0",
              color: "#9e9e9e",
            },
            mb: 3,
          }}
        >
          Login
        </Button>
 
        {/* <Box sx={{ textAlign: "center" }}>
          <Typography
            component="a"
            href="#"
            sx={{
              color: "#0288d1",
              textDecoration: "none",
              fontSize: "14px",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            Forgot Password
          </Typography>
        </Box> */}
      </Paper>
    </Box>
  )
}
 
export default Login
 