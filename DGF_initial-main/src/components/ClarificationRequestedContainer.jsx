import ClarificationRequested from "./Training/ClarificationRequested";

const ClarificationRequestedContainer = () => {
    const styles = {
        clarificationRequestedContainer: {
      
             // display: 'flex',
    // justifyContent: 'center',
    // alignItems: 'flex-start',
    // minHeight: '100vh',
    padding: '10px 30px',
    position: 'relative',
    boxSizing: 'border-box',
    // overflowY: 'auto',
    // width: 'calc(100% - 240px)', /* Adjust width to account for sidebar */
    marginLeft: '240px',
    marginRight: '40px',
    maxHeight: '100vh',
    maxWidth: '100%'
        }
    };


  return (
    <div className="clarification-awaited-container" style={styles.clarificationRequestedContainer}>
        <ClarificationRequested />
  </div>
  )
}

export default ClarificationRequestedContainer