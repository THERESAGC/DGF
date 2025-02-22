import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, InputBase, Menu, MenuItem, Avatar, Typography, Badge, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AuthContext from '../Auth/AuthContext';
import './Header.css';
import { toPascalCase } from '../../utils/stringUtils';
import { arrayBufferToBase64 } from '../../utils/ImgConveter';
import axios from 'axios';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (user && user.profile_image && user.profile_image.data) {
      const base64Flag = `data:image/jpeg;base64,${arrayBufferToBase64(user.profile_image.data)}`;
      setProfileImage(base64Flag);
    }
  }, [user]);

  useEffect(() => {
    const fetchNotifications = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/notifications', {
                params: { empId: user.emp_id, roleId: user.role_id }  // Fetch notifications based on role
            });
            setNotifications(response.data);
            setUnreadCount(response.data.filter(notification => !notification.is_read).length);
        } catch (err) {
            console.error('Error fetching notifications:', err);
        }
    };

    if (user) {
        fetchNotifications();
    }
}, [user]);


  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleNotificationClick = async (notification) => {
    setSelectedNotification(notification);
    setDialogOpen(true);

    if (!notification.is_read) {
        try {
            await axios.post('http://localhost:8000/api/notifications/mark-as-read', {
                notificationId: notification.id,
                empId: user.emp_id  // Pass empId to mark it as read for the specific user
            });
            setNotifications(notifications.map(n => n.id === notification.id ? { ...n, is_read: true } : n));
            setUnreadCount(unreadCount - 1);
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    }
};

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedNotification(null);
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
        <IconButton color="inherit" style={{ paddingRight: '30px', paddingBottom: "30px" }} onClick={handleNotificationMenuOpen}>
          <Badge badgeContent={unreadCount} color="secondary">
            <img src="src/assets/Notification-icon.svg" alt="Notification" style={{ width: '18px', height: '18px' }} />
          </Badge>
        </IconButton>

        {/* Notification Dropdown Menu */}
        <Menu
          anchorEl={notificationAnchorEl}
          open={Boolean(notificationAnchorEl)}
          onClose={handleNotificationMenuClose}
        >
          {notifications.length === 0 ? (
            <MenuItem>No new notifications</MenuItem>
          ) : (
            notifications.map((notification) => (
              <MenuItem key={notification.id} onClick={() => handleNotificationClick(notification)}>
                <Typography variant="body2" style={{ fontWeight: notification.is_read ? 'normal' : 'bold' }}>
                  Request ID: {notification.requestid} - {notification.requeststatus}
                </Typography>
              </MenuItem>
            ))
          )}
        </Menu>

        {/* Notification Details Dialog */}
        <Dialog open={dialogOpen} onClose={handleDialogClose}>
          <DialogTitle>Notification Details</DialogTitle>
          <DialogContent>
            {selectedNotification && (
              <>
                <DialogContentText>
                  <strong>Request ID:</strong> {selectedNotification.requestid}
                </DialogContentText>
                <DialogContentText>
                  <strong>Status:</strong> {selectedNotification.requeststatus}
                </DialogContentText>
                <DialogContentText>
                  <strong>Modified Date:</strong> {new Date(selectedNotification.modifieddate).toLocaleString()}
                </DialogContentText>
                <DialogContentText>
                  <strong>Requested By:</strong> {selectedNotification.requestedby_name}
                </DialogContentText>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

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