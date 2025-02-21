import { useState, useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../Auth/AuthContext';
import '../Training/TrainingHeaderBtn.css';
 
const TrainingHeaderBtn = () => {
  const [selectedButton, setSelectedButton] = useState('My Learning Requests');
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Get the user from AuthContext
 
  const handleButtonClick = (button, path) => {
    setSelectedButton(button);
    navigate(path);
  };
 
  return (
    <AppBar position="static" className="appBar">
      <Toolbar className="toolbar">
        <Box className="box">
          {[
            { text: 'My Learning Requests', path: '/training-container' },
            { text: 'Learning Dashboard', path: '/training-dashboard' },
            { text: 'Reminders', path: '/reminders' },
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
            New Request
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
 
export default TrainingHeaderBtn;