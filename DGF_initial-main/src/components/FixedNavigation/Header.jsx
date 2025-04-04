import { useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  FormControlLabel,
  Switch,
  ListItemIcon,
} from "@mui/material"
import AuthContext from "../Auth/AuthContext"
import "./Header.css"
import { toPascalCase } from "../../utils/stringUtils"
import { arrayBufferToBase64 } from "../../utils/ImgConveter"
import axios from "axios"
 import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import NotificationIcon from "../../assets/Notification-icon.svg"
import ArrowDownIcon from "../../assets/arrow-down.svg"
import { LogOutIcon } from "lucide-react"
import { backendUrl } from "../../../config/config"

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null)
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const [profileImage, setProfileImage] = useState("")
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [showAllNotifications, setShowAllNotifications] = useState(false)
  // const location = useLocation() // Get the current location
  useEffect(() => {
    if (user && user.profile_image && user.profile_image.data) {
      const base64Flag = `data:image/jpeg;base64,${arrayBufferToBase64(user.profile_image.data)}`
      setProfileImage(base64Flag)
    }
  }, [user])
 
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${backendUrl}api/notifications`, {
          params: { empId: user.emp_id, roleId: user.role_id }, // Fetch notifications based on role
        })
        setNotifications(response.data)
        setUnreadCount(response.data.filter((notification) => !notification.is_read).length)
      } catch (err) {
        console.error("Error fetching notifications:", err)
      }
    }
 
    if (user) {
      fetchNotifications() // Initial fetch
 
      const intervalId = setInterval(() => {
        fetchNotifications() // Periodic fetch
      }, 30000) // Fetch every 30 seconds
 
      return () => clearInterval(intervalId) // Cleanup on component unmount
    }
  }, [user])
 
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

    // Modified notification rendering logic
    const filteredNotifications = showAllNotifications
    ? notifications
    : notifications.filter(notification => !notification.is_read);
 
  const handleMenuClose = () => {
    setAnchorEl(null)
  }
 
  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget)
  }
 
  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null)
    setShowAllNotifications(false) // Reset to show only the first 5 notifications
  }
 
  const handleNotificationClick = async (notification) => {
    setSelectedNotification(notification)
    setDialogOpen(true)
 
    if (!notification.is_read) {
      try {
        await axios.post(`${backendUrl}api/notifications/mark-as-read`, {
          notificationId: notification.id,
          empId: user.emp_id, // Pass empId to mark it as read for the specific user
        })
 
        // Update the notification state locally, only change the read status for the clicked notification
        setNotifications((prevNotifications) =>
          prevNotifications.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n)),
        )
 
        // Decrease unread count
        setUnreadCount((prevCount) => prevCount - 1)
      } catch (err) {
        console.error("Error marking notification as read:", err)
      }
    }
  }
 
  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((notification) => !notification.is_read);
  
      if (unreadNotifications.length > 0) {
        console.log(
          "Marking notifications as read:",
          unreadNotifications.map((n) => n.id)
        );
  
        const requests = unreadNotifications.map((notification) =>
          axios.post(`${backendUrl}api/notifications/mark-as-read`, {
            notificationId: notification.id,
            empId: user.emp_id,
          })
        );
  
        await Promise.all(requests);
  
        // Update the notification state locally, mark all as read
        setNotifications((prevNotifications) =>
          prevNotifications.map((n) => ({ ...n, is_read: true }))
        );
  
        // Reset unread count
        setUnreadCount(0);
      }
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
      if (err.response) {
        console.error("Server response:", err.response.data);
      }
    }
  };
  const handleDialogClose = () => {
    setDialogOpen(false)
    setSelectedNotification(null)
  }
 
  const handleLogout = () => {
    logout()
    navigate("/login")
  }
 
  const handleViewAllClick = () => {
    setShowAllNotifications(true)
  }
 
  const handleProfileClick = () => {
    navigate("/profile")
    handleMenuClose()
  }
 
  return (
    <AppBar position="static" className="header">
      <Toolbar>
        {/* <Typography
          variant="h6"
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            color: "#333333",
            marginBottom: "20px",
          }}
        >
          Demand Generation Framework <span style={{ fontSize: "0.8em", color: "#707070" }}>(DGF)</span>
        </Typography> */}
 
        <img src="src/assets/Media.jpg" alt="Logo" style={{ width: "110px", height: "60px", marginBottom: "20px" }} />
        {/* Spacer to push items to the right */}
        <div style={{ flexGrow: 1 }} />
 
        {/* Notification Icon */}
        <IconButton
          color="inherit"
          style={{ marginRight: "30px", marginBottom: "20px" }}
          onClick={handleNotificationMenuOpen}
        >
          <Badge
            badgeContent={unreadCount}
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: "#FE1F1F",
                color: "white",
                marginTop: "4px",
                marginRight: "-2px",
                width: "18px",
                height: "18px",
                fontSize: "11px",
                borderRadius: "50%",
              },
            }}
          >
            <img
              src={NotificationIcon || "/placeholder.svg"}
              alt="Notification"
              style={{ width: "18px", height: "18px" }}
            />
          </Badge>
        </IconButton>
 
        {/* Notification Dropdown Menu */}
        <Menu anchorEl={notificationAnchorEl}
              open={Boolean(notificationAnchorEl)}
              onClose={handleNotificationMenuClose}>
          <div className="notification_wrapper">
            <div className="noti_header">
              <Typography variant="h6">Notifications</Typography>
              <div className="unread_only">
                <FormControlLabel
                  control={
                    <Switch
                      checked={!showAllNotifications}
                      onChange={() => setShowAllNotifications(!showAllNotifications)}
                      name="unreadOnly"
                      color="primary"
                    />
                  }
                  label="Unread Only"
                />
              </div>
              <Button
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
              >
                Mark All as Read
              </Button>
            </div>
            <List className="notifs__parent">
  {filteredNotifications.length === 0 ? (
    <ListItem>
      <ListItemText
        primary={
          showAllNotifications
            ? "No notifications"
            : "No unread notifications"
        }
      />
    </ListItem>
  ) : (
    filteredNotifications.map((notification) => (
      <div key={notification.id}>
        <ListItem
          button
          onClick={() => handleNotificationClick(notification)}
          sx={{
            backgroundColor: notification.is_read ? "inherit" : "#f0f8ff", // Highlight unread notifications
            fontWeight: notification.is_read ? "normal" : "bold", // Bold text for unread notifications
          }}
        >
          <ListItemText
            primary={`Request ID: ${notification.requestid}`}
            secondary={`Status: ${notification.message}`}
          />
        </ListItem>
        <Divider />
      </div>
    ))
  )}
</List>
            {!showAllNotifications && notifications.length > 3 && (
              <div className="noty_btn_wrapper">
                <Button className="view_all_btn" onClick={handleViewAllClick}>
                  View All
                </Button>
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
                  <strong>Status:</strong> {selectedNotification.message}
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
          <Avatar alt="User" src={profileImage} style={{ width: "200px", height: 100 }} />{" "}
          {/* Use the base64-encoded image */}
          <Typography variant="body1" style={{ marginLeft: "10px", color: "black" }}>
            {user ? toPascalCase(user.name) : "User"}
          </Typography>
          <img
            src={ArrowDownIcon || "/placeholder.svg"}
            alt="Notification"
            style={{ width: "10px", height: "10px", paddingLeft: "10px", fill: "#707070" }}
          />
        </div>
 
        {/* Dropdown Menu */}
       
<Menu
  anchorEl={anchorEl}
  open={Boolean(anchorEl)}
  onClose={handleMenuClose}
  PaperProps={{
    sx: {
      width: "200px", // Increase the width
      borderRadius: "8px", // Add rounded corners
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Add a subtle shadow
      mt: 1, // Add margin at the top
      overflow: "visible", // Ensure the menu doesn't clip
      "&:before": {
        content: '""',
        display: "block",
        position: "absolute",
        top: 0,
        right: 16,
        width: 10,
        height: 10,
        bgcolor: "white",
        transform: "translateY(-50%) rotate(45deg)", // Add a small arrow at the top
        zIndex: 0,
      },
    },
  }}
  anchorOrigin={{
    vertical: "bottom",
    horizontal: "right", // Align with the right corner
  }}
  transformOrigin={{
    vertical: "top",
    horizontal: "right", // Align with the right corner
  }}
>
  <MenuItem
    onClick={handleProfileClick}
    sx={{
      fontSize: "14px",
      fontWeight: 500,
      color: "#333",
      "&:hover": {
        backgroundColor: "#f5f5f5",
      },
    }}
  >
    <ListItemIcon>
      <AccountCircleIcon fontSize="small" />
    </ListItemIcon>
    <ListItemText primary="Profile" />
  </MenuItem>
  <MenuItem
    onClick={handleLogout}
    sx={{
      fontSize: "14px",
      fontWeight: 500,
      color: "#d32f2f",
      "&:hover": {
        backgroundColor: "#fdecea",
      },
    }}
  >
    <ListItemIcon>
      <LogOutIcon style={{
 
    width: "20px",
    height: "20px",
      }} />
    </ListItemIcon>
    <ListItemText primary="Logout" />
  </MenuItem>
</Menu>
      </Toolbar>
    </AppBar>
  )
}
 
export default Header
 