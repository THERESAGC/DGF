import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, InputBase, Menu, MenuItem, Avatar, Typography, Badge, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, List, ListItem, ListItemText, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AuthContext from '../Auth/AuthContext';
import './Header.css';
import { toPascalCase } from '../../utils/stringUtils';
import { arrayBufferToBase64 } from '../../utils/ImgConveter';
import axios from 'axios';

import NotificationIcon from '../../assets/Notification-icon.svg';
import ArrowDownIcon from '../../assets/arrow-down.svg';

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
  const [showAllNotifications, setShowAllNotifications] = useState(false);

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
    setShowAllNotifications(false); // Reset to show only the first 5 notifications
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

            // Update the notification state locally, only change the read status for the clicked notification
            setNotifications(prevNotifications =>
                prevNotifications.map(n =>
                    n.id === notification.id ? { ...n, is_read: true } : n
                )
            );

            // Decrease unread count
            setUnreadCount(prevCount => prevCount - 1);
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

  const handleViewAllClick = () => {
    setShowAllNotifications(true);
  };

  return (
    <AppBar position="static" className="header">
      <Toolbar>
        {/* Search Bar */}
        <div className="search">
          <SearchIcon className='icon' style={{ marginBottom: "28px",paddingBottom:"3px" }} />
          <InputBase placeholder="Search courses" className="search-input" style={{ fontSize: 'smaller', marginbottom:" 0",marginLeft:" 0",paddingleft: "6px" }} />
          <IconButton type="submit" aria-label="search"></IconButton>
        </div>

        {/* Spacer to push items to the right */}
        <div style={{ flexGrow: 1 }} />

        {/* Notification Icon */}
        <IconButton color="inherit" style={{ marginRight:'30px' , marginBottom:'20px' }} onClick={handleNotificationMenuOpen}>
          <Badge badgeContent={unreadCount}  sx={{
      '& .MuiBadge-badge': {
        backgroundColor: '#FE1F1F',
        color: 'white',
        marginTop: '4px',
        marginRight: '-2px',
        width: '18px',
        height: '18px',
        fontSize: '11px',
        borderRadius: '50%',
      },
    }} >

            <img src={NotificationIcon} alt="Notification" style={{ width: '18px', height: '18px'}} />
          </Badge>
        </IconButton>

        {/* Notification Dropdown Menu */}
        <Menu
          anchorEl={notificationAnchorEl}
          open={Boolean(notificationAnchorEl)}
          onClose={handleNotificationMenuClose}
        >
          <div className="notification_wrapper">
            <div className="noti_header">
              <Typography variant="h6">Notifications</Typography>
              <div className="unread_only">
                Unread Only
                <dbx-toggle-switch id="toggle" className="hydrated"></dbx-toggle-switch>
              </div>
            </div>
            <List className="notifs__parent">
              {notifications.length === 0 ? (
                <ListItem>
                  <ListItemText primary="No new notifications" />
                </ListItem>
              ) : (
                (showAllNotifications ? notifications : notifications.slice(0, 5)).map((notification) => (
                  <div key={notification.id}>
                    <ListItem button onClick={() => handleNotificationClick(notification)}>
                      <ListItemText
                        primary={`Request ID: ${notification.requestid}`}
                        secondary={`Status: ${notification.requeststatus}`}
                      />
                      <div title="Click to Mark as Read" className={notification.is_read ? "read_noty" : "unread_noty"}></div>
                    </ListItem>
                    <Divider />
                  </div>
                ))
              )}
            </List>
            {!showAllNotifications && notifications.length > 5 && (
              <div className="noty_btn_wrapper">
                <Button className="view_all_btn" role="link" onClick={handleViewAllClick}>View All</Button>
              </div>
            )}
          </div>
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
                 {selectedNotification.requestonbehalfof_name && (
                  <DialogContentText>
                    <strong>On Behalf Of:</strong> {selectedNotification.requestonbehalfof_name}
                  </DialogContentText>
                )}
                {selectedNotification.approvedby_name && (
                  <DialogContentText>
                    <strong>Approved By:</strong> {selectedNotification.approvedby_name}
                  </DialogContentText>
                )}
               
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

          <img src={ArrowDownIcon} alt="Notification" style={{ width: '10px', height: '10px', paddingLeft: "10px", fill: "#707070" }} />
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