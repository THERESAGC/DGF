import NewTrainingRequest from './Training/NewTrainingRequest';
 
const NewRequestContainer = () => {
const styles = {
  newRequestContainer: {
 
    padding: '10px 65px 0px 30px',
    position: 'relative',
    boxSizing: 'border-box',
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