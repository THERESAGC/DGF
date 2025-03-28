import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../Auth/AuthContext';
 
// Import all images
// import DashboardIcon from '../../assets/dashboard.svg';
import TrainingIcon from '../../assets/Training.svg';
import MyCourseIcon from '../../assets/mycourse.svg';
import Logo from '../../assets/harbinger-logo.svg';
import SettingsIcon from '../../assets/setting.png';
import DashboardIcon from '../../assets/Dashboard.svg';
import '../FixedNavigation/Sidebar.css';
 
const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [selectedTab, setSelectedTab] = useState('');
 
  useEffect(() => {
    const pathToTab = {
      '/dashboardgraph': 'Dashboard',
      '/training-container': 'Learnings',
      '/reminders': 'Learnings',
      '/new-request': 'Learnings',
      '/my-courses': 'My Courses',
      // '/my-events': 'Events',
      '/admin-container': 'Admin Settings',
      '/learning-initiated-details/:requestId': 'Learnings', // Added new route
      '/initiate-learning-details/:requestId': 'Learnings', // Added new route
      '/spoc-approval/:requestId': 'Learnings', // Added new route
      '/requester-information/:requestId': 'Learnings', // Added new route
      '/clarification-requested/:requestId': 'Learnings', // Added new route
    };
 
    const matchedPath = Object.keys(pathToTab).find(path =>
      new RegExp(`^${path.replace(':requestId', '[^/]+')}$`).test(location.pathname)
    );
 
  setSelectedTab(pathToTab[matchedPath] || 'Dashboard');
}, [location.pathname]);
 
  const handleTabClick = (tab, path) => {
    setSelectedTab(tab);
    navigate(path);
  };
 
  const menuItems = [
    {
      text: 'Dashboard',
      icon: <img src={DashboardIcon} alt="Dashboard" style={{ width: 15, height: 15, paddingLeft: 25 }} />,
      path: '/dashboardgraph',
    },
    {
      text: 'Learnings',
      icon: <img src={TrainingIcon} alt="Trainings" style={{ width: 15, height: 15, paddingLeft: 25 }} />,
      path: '/training-container',
    },
    {
      text: 'My Courses',
      icon: <img src={MyCourseIcon} alt="My Courses" style={{ width: 15, height: 15, paddingLeft: 25 }} />,
      path: '/my-courses',
    },
    // {
    //   text: 'Events',
    //   icon: <img src={EventIcon} alt="Events" style={{ width: 15, height: 15, paddingLeft: 25 }} />,
    //   path: '/my-events',
    // },
  ];
 
  if (user?.role_id === 4) {
    menuItems.push({
      text: 'Admin Settings',
      icon: <img src={SettingsIcon} alt="Events" style={{ width: 15, height: 15, paddingLeft: 25 }} />,
      path: '/admin-container',
    });
  }
 
  return (
    <div className="sidebar" style={{ fontFamily: 'Poppins', paddingLeft: 0, paddingRight: 0 }}>
      <div className="logo">
        <img src={Logo} alt="Logo" />
      </div>
      <List style={{ fontFamily: 'Poppins', marginBottom: '30px', marginLeft: '0' }}>
        {menuItems.map((item, index) => (
          <ListItemButton
            key={index}
            className={`sidebar-item ${selectedTab === item.text ? 'selected' : ''}`}
            onClick={() => handleTabClick(item.text, item.path)}
            style={selectedTab === item.text ? { fontWeight: 'bolder', color: '#000000' } : {}}
          >
            <ListItemIcon>
              <img
                src={item.icon.props.src}
                alt={item.icon.props.alt}
                style={{
                  width: 15,
                  height: 15,
                  paddingLeft: 25,
                  filter: selectedTab === item.text ? 'invert(38%) sepia(60%) saturate(1800%) hue-rotate(350deg) brightness(95%) contrast(100%)' : '', // Adjusted filter for #FA5864
                }}
              />
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </div>
  );
};
 
export default Sidebar;
 