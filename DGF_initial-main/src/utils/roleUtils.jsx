const getRoleType = (roleId) => {
  if (roleId === 10) {
    return 'spoc';
  } else if (roleId === 4) {
    return 'CapDev';
  }else if (roleId === 8) {
    return 'RM';
  }else {
    return 'requester';
  }
};
 
export default getRoleType;