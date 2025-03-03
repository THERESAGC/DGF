import Sidebar from './FixedNavigation/Sidebar';
import Header from './FixedNavigation/Header';
import Footer from './FixedNavigation/Footer';
import "./FixedComponent.css";

import PropTypes from 'prop-types';

const FixedComponent = ({ children }) => {
  return (
    <div className="fixed-layout">
      <Sidebar />
      <div className="main-container">
        <Header />
        <div className="content-wrapper">
          {children}
        </div>
        <Footer />
      </div>
    </div>
  );
};

FixedComponent.propTypes = {
  children: PropTypes.node.isRequired,
};

export default FixedComponent;