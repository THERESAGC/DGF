import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
// import DashboardIcon from '@mui/icons-material/Dashboard';
// import SchoolIcon from '@mui/icons-material/School';
// import BookIcon from '@mui/icons-material/Book';
// import EventIcon from '@mui/icons-material/Event';
import '../FixedNavigation/Sidebar.css';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
 
const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('');
 
  useEffect(() => {
    const pathToTab = {
     '/dashboardgraph': 'Dashboard',
      '/training-container': 'Learnings',
      '/new-request': 'Learnings', // Highlight Trainings tab for new request path
      '/my-courses': 'My Courses',
      '/my-events': 'Events',
      '/spoc-approval': 'Learnings',
      '/clarification-requested': 'Learnings',
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
        <img src="src/assets/harbinger-logo.svg" alt="Logo" /> {/* Replace with your logo image path */}
      </div>
      <List  style={{fontFamily: 'Poppins', marginBottom: '30px' , marginLeft:'0'}} >
        {[
           {
            text: 'Dashboard',
            icon: <img src="src/assets/Dashboard.svg" alt="Dashboard" style={{ width: 15, height: 15,paddingLeft : 25}} />,
            path: '/dashboardgraph',
          },
         
          {
            text: 'Learnings',
            icon: <img src="src/assets/Training.svg" alt="Trainings" style={{ width: 15, height: 15 ,paddingLeft : 25 }} />,
            path: '/training-container',
          },
          {
            text: 'My Courses',
            icon: <img src="src/assets/mycourse.svg" alt="My Courses" style={{ width: 15, height: 15 ,paddingLeft : 25}} />,
            path: '/my-courses',
          },
          {
            text: 'Events',
            icon: <img src="src/assets/event.svg" alt="Events" style={{ width: 15, height: 15 ,paddingLeft : 25}} />,
            path: '/my-events',
          },
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