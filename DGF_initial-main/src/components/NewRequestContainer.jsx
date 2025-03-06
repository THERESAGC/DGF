import NewTrainingRequest from './Training/NewTrainingRequest';
 
const NewRequestContainer = () => {
const styles = {
  newRequestContainer: {
 
    padding: '10px 12px',
    position: 'relative',
    boxSizing: 'border-box',
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