import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FixedComponent from './components/FixedComponent';
import TrainingContainer from './components/TrainingContainer';
import NewRequestContainer from './components/NewRequestContainer';
import InitiateTrainingContainer from './components/InitiateTrainingContainer.jsx';
import SpocContainer from './components/SpocContainer';
import Login from './components/Auth/Login';
import ProtectedRoute from './components/Auth/ProctectedRoutes.jsx';
import { AuthProvider } from './components/Auth/AuthContext.jsx';
import ClarificationRequestedContainer from './components/ClarificationRequestedContainer.jsx';
import { ChatProvider } from './components/context/ChatContext.jsx';
import LearningInitiatedDetails from './components/CapDevTrainInitiate/LearningInitiatedDetails.jsx';
import InitiateLearningDetails from './components/CapDevTrainInitiate/InitiateLearningDetails.jsx';
import RequestInfoContainer from './components/RequestInfoContainer.jsx';
import DashboardContainer from './components/DashboardContainer.jsx'
import AdminContainer from './components/Admin/AdminContainer.jsx';
import PasswordUpdate from './components/Auth/PasswordUpdate.jsx';   
import ManagerFeedbackForm from './components/Feedback/ManagerFeedbackForm.jsx';
import UserFeedbackForm from './components/Feedback/UserFeedbackForm.jsx';
import Profile from './components/FixedNavigation/Profile.jsx';
import FeedbackDashboard from './components/Admin/feedback-dashboard.jsx'; 

function App() {
  const obj = {
    color: "black",
  };
 
  return (
    <AuthProvider>
      <div style={obj} className='App'>
        <Router>
          <ChatProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute element={<FixedComponent><TrainingContainer /></FixedComponent>} />} />
            <Route path="/training-container" element={<ProtectedRoute element={<FixedComponent><TrainingContainer /></FixedComponent>} />} />
            <Route path="/new-request" element={<ProtectedRoute element={<FixedComponent><NewRequestContainer /></FixedComponent>} />} />
            <Route path="/initiate-training" element={<ProtectedRoute element={<FixedComponent><InitiateTrainingContainer /></FixedComponent>} />} />
            <Route path='/spoc-approval/:requestid' element={<ProtectedRoute element={<FixedComponent><SpocContainer /></FixedComponent>} />} />
            <Route path='/clarification-requested/:requestid' element={<ProtectedRoute element={<FixedComponent><ClarificationRequestedContainer /></FixedComponent>} />} />
            <Route path='/learning-initiated-details/:requestId' element={<ProtectedRoute element={<FixedComponent><LearningInitiatedDetails /></FixedComponent>} />} />
            <Route path='/initiate-learning-details/:requestId' element={<ProtectedRoute element={<FixedComponent><InitiateLearningDetails /></FixedComponent>} />} />
            <Route path='/requester-information/:requestId' element={<ProtectedRoute element={<FixedComponent><RequestInfoContainer /></FixedComponent>} />} /> 
            <Route path='/dashboardgraph' element={<ProtectedRoute element={<FixedComponent><DashboardContainer  /></FixedComponent>} />} /> 
            <Route path='/admin-container' element={<ProtectedRoute element={<FixedComponent><AdminContainer /></FixedComponent>} />} />
            <Route path='/password-update' element={<PasswordUpdate />} />
            <Route path='/feedback' element={<ManagerFeedbackForm/>} />
            <Route path='/userfeedback' element={<UserFeedbackForm/>} />
            <Route path='/profile' element={<ProtectedRoute element={<FixedComponent><Profile /></FixedComponent>} />} />
            <Route path='/feedback-dashboard' element={<ProtectedRoute element={<FixedComponent><FeedbackDashboard /></FixedComponent>} />} />
           
          </Routes>
          </ChatProvider>
        </Router>
      </div>
    </AuthProvider>
  );
}
 
export default App;
 