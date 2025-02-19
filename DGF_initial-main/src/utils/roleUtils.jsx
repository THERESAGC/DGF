const getRoleType = (roleId) => {
    if (roleId === 10) {
      return 'spoc';
    } else if (roleId === 4) {
      return 'CapDev';
    } else {
      return 'requester';
    }
  };
  
  export default getRoleType;