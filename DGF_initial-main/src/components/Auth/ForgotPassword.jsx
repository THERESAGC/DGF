import { useState } from "react";
import { TextField, Button, Box, Typography, Paper, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { backendUrl } from '../../../config/config';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
const[ dialogOpen, setDialogOpen] = useState(false);
const navigate = useNavigate();
  const validateEmail = (email) => {
    if (!email) return false;
    const isValidFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidFormat) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };
 
  const handleSubmit = async () => {
    if (!validateEmail(email)) return;
 
    setIsSubmitting(true);
    setErrorMessage(""); // Reset any previous error messages
    setSuccessMessage(""); // Reset success message
 
    try {
      // Make a request to the API to send a password change email
      const response = await axios.post(`${backendUrl}api/request-password-change`, {
        email,
      });
 
      if (response.status === 200) {
        // setSuccessMessage("A password reset link has been sent to your email.");
        setDialogOpen(true);
      } else {
        setErrorMessage("Failed to request password change.");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(error.response?.data?.message || "An error occurred");
    }
 
    setIsSubmitting(false);
  };
const handleDialogClose = () => {
  setDialogOpen(false);
  navigate("/login"); // Redirect to login page after closing the dialog
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
        padding: "20px",
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
        <Typography variant="h5" sx={{ textAlign: "center", mb: 3 }}>
          Forgot Password
        </Typography>
 
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
            Email Address
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
 
        {successMessage && (
          <Typography sx={{ color: "green", textAlign: "center", mb: 3 }}>
            {successMessage}
          </Typography>
        )}
 
        {errorMessage && (
          <Typography sx={{ color: "red", textAlign: "center", mb: 3 }}>
            {errorMessage}
          </Typography>
        )}
 
        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubmitting}
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
          }}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </Paper>
   {/* Success Dialog */}
   <Dialog
  open={dialogOpen}
  onClose={handleDialogClose}
  PaperProps={{
    sx: {
      borderRadius: "12px",
      padding: "20px",
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    },
  }}
>
  <DialogTitle
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
   
      color: "black",
 
      fontSize: "20px",
      padding: "16px",
      borderTopLeftRadius: "12px",
      borderTopRightRadius: "12px",
    }}
  >
    Your password reset link has been sent to your email !
  </DialogTitle>
  <DialogContent
    sx={{
      textAlign: "center",
      padding: "20px",
      fontSize: "16px",
      color: "#333",
    }}
  >
    <Typography>{successMessage}</Typography>
  </DialogContent>
  <DialogActions
    sx={{
      justifyContent: "center",
      padding: "16px",
    }}
  >
    <Button
      onClick={handleDialogClose}
      variant="contained"
      sx={{
        backgroundColor: "#0288d1",
        color: "white",
        textTransform: "none",
        fontWeight: "bold",
        padding: "8px 24px",
        borderRadius: "8px",
        "&:hover": {
          backgroundColor: "#0277bd",
        },
      }}
    >
      OK
    </Button>
  </DialogActions>
</Dialog>
    </Box>
  );
};
 
export default ForgotPassword;