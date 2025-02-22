import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, InputBase, Menu, MenuItem, Avatar, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AuthContext from '../Auth/AuthContext';
import './Header.css';
import { toPascalCase } from '../../utils/stringUtils';
import { arrayBufferToBase64 } from '../../utils/ImgConveter';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState('');

  useEffect(() => {
    if (user && user.profile_image && user.profile_image.data) {
      const base64Flag = `data:image/jpeg;base64,${arrayBufferToBase64(user.profile_image.data)}`;
      setProfileImage(base64Flag);
    }
  }, [user]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" className="header">
      <Toolbar>
        {/* Search Bar */}
        <div className="search">
          <SearchIcon style={{ paddingBottom: "20px" }} />
          <InputBase placeholder="Search courses" className="search-input" style={{ fontSize: 'smaller' }} />
          <IconButton type="submit" aria-label="search"></IconButton>
        </div>

        {/* Spacer to push items to the right */}
        <div style={{ flexGrow: 1 }} />

        {/* Notification Icon */}
        <IconButton color="inherit" style={{ paddingRight: '30px', paddingBottom: "30px" }}>
          <img src="src/assets/Notification-icon.svg" alt="Notification" style={{ width: '18px', height: '18px' }} />
        </IconButton>

        {/* Profile Image and Dropdown */}
        <div className="profile" onClick={handleMenuOpen}>
          <Avatar alt="User" src={profileImage} style={{ width: '200px', height: 100 }} /> {/* Use the base64-encoded image */}
          <Typography variant="body1" style={{ marginLeft: '10px', color: 'black' }}>
            {user ? toPascalCase(user.name) : 'User'}
          </Typography>
          <img src="src/assets/arrow-down.svg" alt="Notification" style={{ width: '10px', height: '10px', paddingLeft: "10px", fill: "#707070" }} />
        </div>

        {/* Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
          <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;