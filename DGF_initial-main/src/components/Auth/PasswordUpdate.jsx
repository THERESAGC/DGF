
// export default PasswordUpdate;
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TextField, Button, Box, Paper, InputLabel } from "@mui/material";
import axios from "axios";
import backgroundImage from "../../assets/Onelogin-BG 1.jpg"; // Your background image
import logo from "../../assets/harbinger-logo.svg"; // Your logo

const PasswordUpdate = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [repeatPasswordError, setRepeatPasswordError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const navigate = useNavigate();
  const location = useLocation(); // Get the current URL
  const [token, setToken] = useState(""); // State to store the token

  // Get the token from the URL query params
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromURL = queryParams.get("token");
    setToken(tokenFromURL); // Set the token from URL
  }, [location]);

  // Validate form on input change
  useEffect(() => {
    validateForm();
  }, [email, password, newPassword, repeatPassword]);

  const validateEmail = (email) => {
    if (!email) return false;
    const isValidFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const hasValidDomain = email.endsWith("example.com") || email.endsWith("harbingergroup.com");

    if (!isValidFormat) {
      setEmailError("Please enter a valid email address");
      return false;
    } else if (!hasValidDomain) {
      setEmailError("Email must be from example.com or harbingergroup.com");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };

  const validatePasswords = () => {
    let isNewPasswordValid = false;
    let isRepeatPasswordValid = false;

    if (!newPassword) {
      setNewPasswordError("New password is required");
    } else if (newPassword.length < 8) {
      setNewPasswordError("Password must be at least 8 characters");
    } else {
      setNewPasswordError("");
      isNewPasswordValid = true;
    }

    if (!repeatPassword) {
      setRepeatPasswordError("Please confirm your new password");
    } else if (repeatPassword !== newPassword) {
      setRepeatPasswordError("Passwords do not match");
    } else {
      setRepeatPasswordError("");
      isRepeatPasswordValid = true;
    }

    return isNewPasswordValid && isRepeatPasswordValid;
  };

  const validateForm = () => {
    const isEmailValid = validateEmail(email);
    const isCurrentPasswordValid = password.length > 0;
    const areNewPasswordsValid = validatePasswords();

    setIsFormValid(isEmailValid && isCurrentPasswordValid && areNewPasswordsValid);
  };

  const handleUpdatePassword = async () => {
    if (!isFormValid || !token) {
      alert("Please fill in all fields correctly or make sure the token is available");
      return;
    }

    try {
      // Construct payload with token and new password
      const payload = {
        token,
        existingPassword: password || undefined, // Send undefined if existingPassword is empty
        newPassword,
      };

      console.log("Payload:", payload); // Log the payload for debugging

      // Make API request to the change password endpoint
      const response = await axios.post(
        "http://localhost:8000/api/change-password", // Your backend URL
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Handle success response
      if (response.data.message === "Password changed successfully") {
        alert("Password updated successfully");
        navigate("/login"); // Redirect to login page
      } else {
        alert("Password update failed");
      }
    } catch (error) {
      console.error("Password update error:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert("Password update failed");
      }
    }
  };

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
        backgroundSize: "cover",
        backgroundPosition: "center",
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
            src={logo} // Display logo
            alt="Your Logo"
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
            placeholder="email@domain.com"
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
                  padding: "10px 14px",
                },
              },
            }}
            InputProps={{
              sx: { borderRadius: 1 },
            }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <InputLabel
            htmlFor="password"
            sx={{
              color: "#666",
              fontSize: "14px",
              mb: 1,
              fontWeight: 400,
            }}
          >
            Current Password
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
                  padding: "10px 14px",
                },
              },
            }}
            InputProps={{
              sx: { borderRadius: 1 },
            }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <InputLabel
            htmlFor="newPassword"
            sx={{
              color: "#666",
              fontSize: "14px",
              mb: 1,
              fontWeight: 400,
            }}
          >
            New Password
          </InputLabel>
          <TextField
            id="newPassword"
            type="password"
            fullWidth
            variant="outlined"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={!!newPasswordError}
            helperText={newPasswordError}
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
                  padding: "10px 14px",
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
            htmlFor="repeatPassword"
            sx={{
              color: "#666",
              fontSize: "14px",
              mb: 1,
              fontWeight: 400,
            }}
          >
            Repeat Password
          </InputLabel>
          <TextField
            id="repeatPassword"
            type="password"
            fullWidth
            variant="outlined"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            error={!!repeatPasswordError}
            helperText={repeatPasswordError}
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
                  padding: "10px 14px",
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
          onClick={handleUpdatePassword}
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
          Update Password
        </Button>
      </Paper>
    </Box>
  );
};

export default PasswordUpdate;
