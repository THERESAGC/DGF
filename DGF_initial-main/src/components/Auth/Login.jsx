import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';
import axios from 'axios';
import AuthContext from './AuthContext';
import logo from '../../assets/harbinger-logo.svg'; 
 
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
 
  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/auth/login', { email, password });
      if (response.data.message === "Login successful") {
        login(response.data.user);
        navigate('/dashboardgraph');
      } else {
        alert('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed');
    }
  };
 
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh" style={{ backgroundColor: '#f0f0f0' }}>
      <Paper elevation={3} style={{ padding: '30px', maxWidth: '500px', width: '100%', backgroundColor: '#ffffff !' }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <img src={logo} alt="Habinger Logo" style={{ marginBottom: '20px', width: '150px' }} />
          <Typography variant="h4" gutterBottom>Login</Typography>
        </Box>
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
        <Box display="flex" justifyContent="center" style={{ marginTop: '20px' }}>
          <Button variant="contained" color="primary" onClick={handleLogin}>
            Login
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};
 
export default Login;
 