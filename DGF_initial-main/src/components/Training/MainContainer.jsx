import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TrainingContainer from './TrainingContainer';
import DashboardContainer from './Dashboard/DashboardContainer';
import Sidebar from './FixedNavigation/Sidebar';
 
const MainContainer = () => {
 
 
  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="/training-container" element={<TrainingContainer />} />
        <Route path="/dashboard" element={<DashboardContainer />} />
      </Routes>
    </Router>
  );
};
 
export default MainContainer;