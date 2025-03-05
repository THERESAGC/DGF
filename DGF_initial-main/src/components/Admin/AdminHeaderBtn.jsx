import { useState, useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../Auth/AuthContext';
import './AdminHeaderBtn.css';
 
const AdminHeaderBtn = () => {
  const [selectedButton, setSelectedButton] = useState('My Learning Requests');
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Get the user from AuthContext
 
  const handleButtonClick = (button, path) => {
    setSelectedButton(button);
    navigate(path);
  };
 
  return (
    <AppBar position="static" className="AdminBar">
      <Toolbar className="toolbar">
        <Box className="box">
          {[
            { text: 'Users', path: '/admin-container' },
            // { text: 'Learning Dashboard', path: '/training-dashboard' },
            { text: 'Roles', path: '' },
          ].map((item) => (
            <Typography
              key={item.text}
              variant="h6"
              component="div"
              className={`typography ${selectedButton === item.text ? 'selected' : ''}`}
              onClick={() => handleButtonClick(item.text, item.path)}
            >
              {item.text}
            </Typography>
          ))}
        </Box>
        <Box className="box">
          <Button
            variant="contained"
            color="primary"
            className="button"
            onClick={() => navigate('/new-request')}
            disabled={user.role_id === 10} // Disable the button if role_id is 10
          >
            Add User
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
 
export default AdminHeaderBtn;