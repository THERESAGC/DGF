import ClarificationAwaited from "./Training/ClarificationAwaited";

const ClarificationAwaitedContainer = () => {
    const styles = {
        clarificationAwaitedContainer: {
      
            // display: 'flex',
            // justifyContent: 'center',
            // alignItems: 'flex-start',
            // minHeight: '100vh',
            padding: '10px 30px',
            position: 'relative',
            boxSizing: 'border-box',
            backgroundColor: '#F6FAFF',
            // overflowY: 'auto',
            // width: 'calc(100% - 240px)', /* Adjust width to account for sidebar */
            marginLeft: '270px',
            marginRight: '40px',
            maxHeight: '100vh',
            maxWidth: '100%'
        }
    };


  return (
    <div className="clarification-awaited-container" style={styles.clarificationAwaitedContainer}>
        <ClarificationAwaited />
  </div>
  )
}

export default ClarificationAwaitedContainer