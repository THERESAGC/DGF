import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Snackbar, SnackbarContent } from '@mui/material';
import axios from 'axios';
import AuthContext from './AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar visibility state
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Snackbar message state
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/auth/login', { email, password });
      if (response.data.message === "Login successful") {
        login(response.data.user);
        navigate('/training-container');
      } else {
        setSnackbarMessage('Login failed !');
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error('Login error:', error);
      setSnackbarMessage('Login failed!');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false); // Close the Snackbar
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
      <Typography variant="h4" gutterBottom>Login</Typography>
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        margin="normal"
        fullWidth
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
        fullWidth
      />
      <Button variant="contained" color="primary" onClick={handleLogin} style={{ marginTop: '20px' }}>
        Login
      </Button>

      {/* Custom Styled Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000} // Automatically hide after 6 seconds
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // Centered position
      >
        <SnackbarContent
          message={snackbarMessage}
          style={{
            backgroundColor: 'rgba(224, 112, 26, 0.68)', // Red background for error
            color: '#ffff', 
            width: '80px',
            height: '30px',             // White text
            borderRadius: '8px',        // Rounded corners
            padding: '16px 32px',       // Padding around the text
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)', // Subtle shadow for depth
            fontSize: '16px',           // Increase font size for better readability
            fontFamily: 'Poppins',      // Apply Poppins font
          }}
        />
      </Snackbar>
    </Box>
  );
};

export default Login;
