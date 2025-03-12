import NewTrainingRequest from './Training/NewTrainingRequest';
 
const NewRequestContainer = () => {
const styles = {
  newRequestContainer: {
 
    padding: '10px 4px',
    position: 'relative',
    boxSizing: 'border-box',
    marginRight: '58px',
    
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