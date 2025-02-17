import { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../Training/TrainingHeaderBtn.css';
 
const TrainingHeaderBtn = () => {
  const [selectedButton, setSelectedButton] = useState('My Training Requests');
  const navigate = useNavigate();
 
  const handleButtonClick = (button, path) => {
    setSelectedButton(button);
    navigate(path);
  };
 
  return (
    <AppBar position="static" className="appBar">
      <Toolbar className="toolbar">
        <Box className="box">
          {[
            { text: 'My Training Requests', path: '/training-container' },
            { text: 'Training Dashboard', path: '/training-dashboard' },
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
          >
           New Request
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
 
export default TrainingHeaderBtn;