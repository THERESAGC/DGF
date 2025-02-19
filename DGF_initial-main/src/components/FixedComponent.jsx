
import Sidebar from './FixedNavigation/Sidebar'
import Header from './FixedNavigation/Header'
import Footer from './FixedNavigation/Footer'

import PropTypes from 'prop-types';

const FixedComponent = ({children}) => {
  return (
    <>
     <Sidebar />
     <Header />
     <div>{children}</div>
     <Footer />
    </>
  );
};

FixedComponent.propTypes = {
  children: PropTypes.node.isRequired,
};


export default FixedComponent;
