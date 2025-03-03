import NewTrainingRequest from './Training/NewTrainingRequest';
 
const NewRequestContainer = () => {
const styles = {
  newRequestContainer: {
 
    // display: 'flex',
    // justifyContent: 'center',
    // alignItems: 'flex-start',
    // minHeight: '100vh',
    padding: '10px 30px',
    position: 'relative',
    boxSizing: 'border-box',
    // overflowY: 'auto',
    // width: 'calc(100% - 240px)', /* Adjust width to account for sidebar */
    // marginLeft: '240px',
    marginRight: '40px',
    maxHeight: '100vh',
    maxWidth: '100%'
}
};
 
  return (
    <>
    <div className="new-request-container" style={styles.newRequestContainer}>
      <NewTrainingRequest />
    </div>
    </>
  );
};
 
export default NewRequestContainer;