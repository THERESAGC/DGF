import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import BookIcon from '@mui/icons-material/Book';
import EventIcon from '@mui/icons-material/Event';
import '../FixedNavigation/Sidebar.css';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
 
const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('');
 
  useEffect(() => {
    const pathToTab = {
      '/dashboard': 'Dashboard',
      '/training-container': 'Trainings',
      '/new-request': 'Trainings', // Highlight Trainings tab for new request path
      '/my-courses': 'My Courses',
      '/my-events': 'Events',
    };
    setSelectedTab(pathToTab[location.pathname] || 'Dashboard');
  }, [location.pathname]);
 
  const handleTabClick = (tab, path) => {
    setSelectedTab(tab);
    navigate(path);
  };
 
  return (
    <div className="sidebar" style={{fontFamily: 'Poppins', paddingLeft:0, paddingRight:0}}> {/* Add your font-family */}
      <div className="logo">
        <img src="src/assets/harbinger-logo.png.webp" alt="Logo" /> {/* Replace with your logo image path */}
      </div>
      <List  style={{fontFamily: 'Poppins', marginBottom: '30px' , marginLeft:'0'}} >
        {[
          { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard'},
          { text: 'Trainings', icon: <SchoolIcon />, path: '/training-container'},
          { text: 'My Courses', icon: <BookIcon />, path: '/my-courses'},
          { text: 'Events', icon: <EventIcon />, path: '/my-events'},
        ].map((item, index) => (
          <ListItemButton
            key={index}
            className={`sidebar-item ${selectedTab === item.text ? 'selected' : ''}`}  // Add a class for custom hover styles
            onClick={() => handleTabClick(item.text, item.path)}
            style={selectedTab === item.text ? { fontWeight: 'bolder', color: '#000000'} : {}}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </div>
  );
};
 
export default Sidebar;