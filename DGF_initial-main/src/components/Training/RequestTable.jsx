// import { useState, useRef, useEffect ,useContext} from "react";
// import PropTypes from 'prop-types';
// import { useNavigate } from "react-router-dom";
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Typography, IconButton, TablePagination, Tabs, Tab, TextField, MenuItem, Box } from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
// import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
// import "../Training/RequestTable.css";
// import getRoleType from '../../utils/roleUtils';
// import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
// import Badge from '@mui/material/Badge';
// import AuthContext from "../Auth/AuthContext";

// const data = [
//   { id: "123", project: "iAlign", learners: 5, completedLearners: 3, objective: "Upskilling", techStack: "Accessibility", requestedOn: "Jan 20, 2025", status: "Learning in Progress" },
//   { id: "231", project: "Staffing Nation", learners: 5, completedLearners: 2, objective: "Upskilling", techStack: "React", requestedOn: "Jan 20, 2025", status: "SPOC Approval Awaited" },
//   { id: "321", project: "Other Project Name", learners: 3, completedLearners: 0, objective: "Upskilling", techStack: "Soft Skills", requestedOn: "Jan 15, 2025", status: "Preparing Learning Plan" },
//   { id: "322", project: "Another Project", learners: 4, completedLearners: 4, objective: "Upskilling", techStack: "Python", requestedOn: "Jan 8, 2025", status: "Completed" },
//   { id: "323", project: "Yet Another Project", learners: 3, completedLearners: 1, objective: "Upskilling", techStack: "Node.js", requestedOn: "Jan 5, 2025", status: "Clarification Requested" },
//   { id: "324", project: "Hold Project", learners: 2, completedLearners: 0, objective: "Upskilling", techStack: "Java", requestedOn: "Jan 2, 2025", status: "Hold" },
//   { id: "325", project: "New Project", learners: 6, completedLearners: 6, objective: "Upskilling", techStack: "Angular", requestedOn: "Jan 10, 2025", status: "Partially Completed" },
//   { id: "326", project: "Old Project", learners: 7, completedLearners: 5, objective: "Upskilling", techStack: "Vue.js", requestedOn: "Jan 12, 2025", status: "Completed with Delay" },
//   { id: "327", project: "Future Project", learners: 8, completedLearners: 8, objective: "Upskilling", techStack: "React Native", requestedOn: "Jan 14, 2025", status: "Completed" },
//   { id: "328", project: "Past Project", learners: 4, completedLearners: 3, objective: "Upskilling", techStack: "Django", requestedOn: "Jan 16, 2025", status: "Partially Completed" },
//   { id: "329", project: "Incomplete Project 1", learners: 5, completedLearners: 2, objective: "Upskilling", techStack: "JavaScript", requestedOn: "Jan 18, 2025", status: "Incomplete" },
//   { id: "330", project: "Incomplete Project 2", learners: 6, completedLearners: 3, objective: "Upskilling", techStack: "TypeScript", requestedOn: "Jan 19, 2025", status: "Incomplete" },
//   { id: "331", project: "Rejected Project 1", learners: 4, completedLearners: 1, objective: "Upskilling", techStack: "Ruby", requestedOn: "Jan 21, 2025", status: "Rejected" },
//   { id: "332", project: "Rejected Project 2", learners: 3, completedLearners: 0, objective: "Upskilling", techStack: "Go", requestedOn: "Jan 22, 2025", status: "Rejected" },
//   { id: "333", project: "Hold Project 2", learners: 5, completedLearners: 2, objective: "Upskilling", techStack: "Swift", requestedOn: "Jan 23, 2025", status: "Hold" },
//   { id: "001", project: "iAl", learners: 5, completedLearners: 3, objective: "Upskilling", techStack: "Accessibility", requestedOn: "Jan 20, 2025", status: "Approval Requested" },
//   { id: "002", project: "Sonia", learners: 5, completedLearners: 3, objective: "Upskilling", techStack: "Accessibility", requestedOn: "Jan 20, 2025", status: "Initiate Training" }
// ];
 
// const requesterInProgressStatuses = ["SPOC Approval Awaited", "Learning in Progress", "Preparing Learning Plan", "Clarification Requested"];
// const spocInProgressStatuses = ["Approval Requested", "Preparing Learning Plan", "Learning in Progress"];
// const capDevInProgressStatuses = ["Initiate Training", "Approval Requested", "Preparing Learning Plan", "Learning in Progress",];
// const completedStatuses = ["Completed", "Partially Completed", "Completed with Delay"];
// const statuses = ["In Progress", "Completed", "Incomplete", "Rejected", "Hold"];
// const daysOptions = ["Last 7 days", "Last 30 days", "Last 90 days", "All"];
 



// const RequestTable = ({ roleId }) => {
//   const navigate = useNavigate();
//   const [page, setPage] = useState(0);
//   const [selectedStatus, setSelectedStatus] = useState("In Progress");
//   const [selectedDays, setSelectedDays] = useState("All");
//   const rowsPerPage = 5;
//   const tabsRef = useRef(null);
//   const [indicatorStyle, setIndicatorStyle] = useState({});
//   const { user } = useContext(AuthContext); // Get the user from AuthContext
//   const role = getRoleType(roleId);
  
//   const [requests, setRequests] = useState([]);
 
//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };
 
//   const handleStatusChange = (event, newValue) => {
//     setSelectedStatus(statuses[newValue]);
//     setPage(0);
//   };
 
//   const handleDaysChange = (event) => {
//     setSelectedDays(event.target.value);
//     setPage(0);
//   };
 
//   const getInProgressStatuses = () => {
//     if (role === "spoc") {
//       return spocInProgressStatuses;
//     } else if (role === "CapDev") {
//       return capDevInProgressStatuses;
//     } else {
//       return requesterInProgressStatuses;
//     }
//   };
 
//   const filteredData = data.filter(row => {
//     if (selectedStatus === "In Progress") {
//       return getInProgressStatuses().includes(row.status);
//     } else if (selectedStatus === "Completed") {
//       return completedStatuses.includes(row.status);
//     } else if (selectedStatus === "Incomplete") {
//       return row.status === "Incomplete";
//     } else if (selectedStatus === "Rejected") {
//       return row.status === "Rejected";
//     } else if (selectedStatus === "Hold") {
//       return row.status === "Hold";
//     }
//     return row.status === selectedStatus;
//   });
 
//   const handleArrowClick = (status) => {
//     if (status === "Initiate Training") {
//       navigate('/initiate-training');
//     }
//     if (status === 'Approval Requested') {
//       navigate('/spoc-approval');
//     }
//   }
//    const handleMessageClick=(status)=>{
//       if(status==="Clarification Requested"){
//         navigate('/clarification-requested');
//       } 
//     }

//   useEffect(() => {
//     if (tabsRef.current) {
//       const selectedTab = tabsRef.current.querySelector(`[aria-selected="true"]`);
//       if (selectedTab) {
//         const { offsetLeft, offsetWidth } = selectedTab;
//         setIndicatorStyle({
//           left: offsetLeft,
//           width: offsetWidth * 0.35, // Set the width to 50% of the tab's width
//           backgroundColor: 'red',
//           borderRadius: '20px',
//           marginLeft: '40px',
//         });
//       }
//     }
//   }, [selectedStatus]);


//   useEffect(() => {
//     if(user){
//       fetch('http://localhost:8000/api/training-requests')
//           .then(response => response.json())
//           .then(data => {
//             console.log('Fetched data:', data); // Print data to console
//             setRequests(data);})
//           .catch(error => console.error('Error fetching data:', error));
//     }
//   }, []);
 
//   return (
//     <TableContainer component={Paper} className="table-container">
//       <div className="filters">
//         <Tabs
//           value={statuses.indexOf(selectedStatus)}
//           onChange={handleStatusChange}
//           variant="scrollable"
//           scrollButtons="auto"
//           ref={tabsRef}
//           TabIndicatorProps={{ style: indicatorStyle }}
//         >
//           {statuses.map(status => (
//             <Tab
//               key={status}
//               label={
//                 <span className={`tab-label ${selectedStatus === status ? 'selected-tab' : ''}`}>
//                   {status}
//                   <span className="tab-label-number">
//                     {data.filter(row => {
//                       if (status === "In Progress") {
//                         return getInProgressStatuses().includes(row.status);
//                       } else if (status === "Completed") {
//                         return completedStatuses.includes(row.status);
//                       } else if (status === "Incomplete") {
//                         return row.status === "Incomplete";
//                       } else if (status === "Rejected") {
//                         return row.status === "Rejected";
//                       } else if (status === "Hold") {
//                         return row.status === "Hold";
//                       }
//                       return row.status === status;
//                     }).length}
//                   </span>
//                 </span>
//               }
//             />
//           ))}
//         </Tabs>
//         <TextField
//           select
//           value={selectedDays}
//           onChange={handleDaysChange}
//           variant="outlined"
//           size="small"
//           style={{ marginLeft: '20px', height: '30px', backgroundColor: "white", width: '105px', marginRight: '-10px' }}
//           InputProps={{
//             style: { fontSize: '0.63rem' } // Decreasing the font size here
//           }}
//           MenuProps={{
//             PaperProps: {
//               style: {
//                 maxHeight: 300, // Optional: you can limit the max height of the dropdown
//                 width: '100px' // You can adjust this to control the width of the dropdown
//               }
//             }
//           }}
//         >
//           {daysOptions.map(option => (
//             <MenuItem key={option} value={option} style={{ fontSize: '0.75rem', padding: '5px 10px' }}>
//               {option}
//             </MenuItem>
//           ))}
//         </TextField>
//       </div>
//       <Table>
//         <TableHead>
//           <TableRow className="table-head">
//             <TableCell>Req No:</TableCell>
//             <TableCell>Project</TableCell>
//             <TableCell>Learners</TableCell>
//             <TableCell>Objective</TableCell>
//             <TableCell>Tech Stack</TableCell>
//             <TableCell>Requested On</TableCell>
//             <TableCell className="no">Status</TableCell>
//             <TableCell> </TableCell> {/* New Column */}
//             <TableCell>Actions</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
//             <TableRow key={index}>
//               <TableCell>{row.id}</TableCell>
//               <TableCell className="project">{row.project}</TableCell>
//               <TableCell>
//                 <Box display="flex" alignItems="center">
//                   {Array.from({ length: Math.min(row.learners, 2) }).map((_, i) => (
//                     <Avatar key={i} style={{ marginLeft: i === 1 ? -1.5 : 1 }}>{row.learners}</Avatar>
//                   ))}
//                   {row.learners > 2 && (
//                     <Box display="flex" alignItems="center" justifyContent="center" style={{ marginLeft: 0, backgroundColor: '#f0f0f0', borderRadius: '50%', width: 20, height: 20 }}>
//                       <Typography variant="body2">+{row.learners - 2}</Typography>
//                     </Box>
//                   )}
//                 </Box>
//               </TableCell>
//               <TableCell>{row.objective}</TableCell>
//               <TableCell>{row.techStack}</TableCell>
//               <TableCell>{row.requestedOn}</TableCell>
//               <TableCell>
//                 <Typography className={`status ${row.status.replace(/\s+/g, '-').toLowerCase()}`}>
//                   {row.status}
//                 </Typography>
//               </TableCell>
//               <TableCell>
//                 {/* New Column for Completion Status */}
//                 {row.status === "Learning in Progress" || completedStatuses.includes(row.status) || row.status === "Incomplete" ?
//                   `${row.completedLearners}/${row.learners} Completed` : ""}
//               </TableCell>
//               <TableCell>
//                 <IconButton onClick={() => handleArrowClick(row.status)}><ArrowCircleRightOutlinedIcon style={{ height: "20px" }} /></IconButton>
//                 {role === "requester" && (row.status === "SPOC Approval Awaited" || row.status === "Clarification Awaited") && (
//                   <IconButton ><EditIcon style={{ height: "15px" }} /></IconButton>
//                 )}
//              {role === "requester" && row.status === "Clarification Requested" && (
//   <IconButton onClick={() => handleMessageClick(row.status)}>
//     <Badge
//       badgeContent={"1 new"}
//       anchorOrigin={{
//         vertical: 'top',
//         horizontal: 'right',
//       }}
//       sx={{
//         '& .MuiBadge-badge': {
//           fontSize: '8px', // Reduce the font size
//           height: '12px', // Reduce the badge size
//           minWidth: '12px', // Reduce the badge size
//           padding: '0 4px', // Adjust padding if needed
//           backgroundColor: '#FFDAB9', // Light orange color (Peach Puff)
//           color: 'black', // Change the text color to black for better contrast
//           border: '1px solid #707070', // Add border color
//           top: '5px', // Move the badge to the upper right corner
//           right: '-5px', // Move the badge to the upper right corner
         
//         },
//       }}
//     >
//       <ChatBubbleOutlineIcon/>
//     </Badge>
//   </IconButton>
// )}
//                 {role === "CapDev" && row.status === "Clarification Awaited" && (
//                   <IconButton><EditIcon style={{ height: "15px" }} /></IconButton>
//                 )}
//                 {role !== "requester" && role !== "CapDev" && row.status === "Clarification Awaited" && (
//                   <IconButton><EditIcon style={{ height: "15px" }} /></IconButton>
//                 )}
                 
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//       <TablePagination
//         rowsPerPageOptions={[5]}
//         component="div"
//         count={filteredData.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         sx={{ display: 'flex', justifyContent: 'flex-start' }}
//       />
     
//     </TableContainer>
//   );
// };
 
// RequestTable.propTypes = {
//   roleId: PropTypes.number.isRequired,
// };
 
// export default RequestTable;


import { useState, useRef, useEffect ,useContext} from "react";
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TablePagination, Tabs, Tab, TextField, MenuItem } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import "../Training/RequestTable.css";
import getRoleType from '../../utils/roleUtils';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import Badge from '@mui/material/Badge';
import AuthContext from "../Auth/AuthContext";
import formatDate from "../../utils/dateUtils";
const statuses = ["In Progress", "Completed", "Incomplete", "Rejected", "Suspended"];
const daysOptions = ["Last 7 days", "Last 30 days", "Last 90 days", "All"];

const RequestTable = ({ roleId }) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState("In Progress");
  const [selectedDays, setSelectedDays] = useState("All");
  const rowsPerPage = 5;
  const tabsRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const { user } = useContext(AuthContext); // Get the user from AuthContext
  const role = getRoleType(roleId);
  const [requests, setRequests] = useState([]); // state for holding requests

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle status tab change
  const handleStatusChange = (event, newValue) => {
    setSelectedStatus(statuses[newValue]);
    setPage(0);
  };

  // Handle days filter change
  const handleDaysChange = (event) => {
    setSelectedDays(event.target.value);
    setPage(0);
  };

 // Updated function to map request status to custom display text and styling
 const mapStatusToDisplayText = (status) => {
  switch (status.toLowerCase()) {
    case "approval requested":
      return { text: ["SPOC Approval ", "Awaited"], color: "red" };
    case "spoc approved":
      return { text: ["Approved"], color: "red" };
    case "capdev approved":
      return { text: ["Approved"], color: "red" };
    case "initiate learning":
      return { text: ["Preparing","Learning Plan"], color: "red" };
    case "learning initiated":
      return { text: ["Learning In","Progress"], color: "red" };
    // New conditional mapping for CapDev or Spoc roles
    case "spoc approval awaited":
      if (role === "CapDev" || role === "Spoc") {
        return { text: ["Approval Requested"], color: "red" };  // Display as "Approval Requested"
      }
      return { text: ["SPOC Approval Awaited"], color: "red" };  // Default behavior
    default:
      return { text: [status], color: "black" };
  }
};


// Update the filtering logic

const filteredData = Array.isArray(requests) ? requests.filter(row => {
  if (selectedStatus === "In Progress") {
    const inProgressStatuses = [
      "approval requested",
      "spoc approved",
      "capdev approved",
      "initiate learning",
      "learning initiated"
    ];
    return row.requeststatus && inProgressStatuses.includes(row.requeststatus.toLowerCase());
  } else if (selectedStatus === "Completed") {
    return row.requeststatus && row.requeststatus.toLowerCase() === "completed";
  } else if (selectedStatus === "Incomplete") {
    return row.requeststatus && row.requeststatus.toLowerCase() === "incomplete";
  } else if (selectedStatus === "Rejected") {
    return row.requeststatus && row.requeststatus.toLowerCase() === "rejected";
  } else if (selectedStatus === "Hold") {
    return row.requeststatus && row.requeststatus.toLowerCase() === "hold";
  }
  return row.requeststatus && row.requeststatus.toLowerCase() === selectedStatus.toLowerCase();
}) : [];
useEffect(() => {
  if (user) {
    fetch('http://localhost:8000/api/training-requests')
      .then(response => response.json())
      .then(data => {
        console.log("Fetched Data:", data); // Log the entire response
        console.log("Data inside response:", data.data); // Log the expected data part

        if (roleId === 10 || roleId === 4) {
          setRequests(data || []); // Set requests directly if the role matches
        } else {
          const userRequests = (data || []).filter(request => request.requestonbehalfof === user.emp_id);
          setRequests(userRequests);
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }
}, [user, roleId]);

// Log requests after state change to see what's inside it
useEffect(() => {
  console.log('Requests State Updated:', requests); // This will log after state change
}, [requests]); // This hook will trigger every time the requests state is updated

// Log the `user` object
useEffect(() => {
  console.log("User object:", user); // Make sure user is not null and has emp_id
}, [user]);


 
  // Navigate to different pages based on status
  const handleArrowClick = (status) => {
    if (status === "Initiate Training") {
      navigate(`/initiate-training`);
    }
    // if (status === 'Approval Requested') {
    //   navigate(`/spoc-approval`);
    // }
  };
// hanlde Edit Click
const handleEditClick = (status,requestId) => {
  console.log('Status:', status);
  console.log('Request ID:', requestId);
  if (status === 'Approval Requested') {
    navigate(`/spoc-approval/${requestId}`);
  }
}
  // Handle message click
  const handleMessageClick = (status) => {
    if(status === "Clarification Requested"){
      navigate('/clarification-requested');
    }
  };


  // Set dynamic styles for tab indicator
  useEffect(() => {
    if (tabsRef.current) {
      const selectedTab = tabsRef.current.querySelector(`[aria-selected="true"]`);
      if (selectedTab) {
        const { offsetLeft, offsetWidth } = selectedTab;
        setIndicatorStyle({
          left: offsetLeft,
          width: offsetWidth * 0.35, // Set the width to 50% of the tab's width
          backgroundColor: 'red',
          borderRadius: '20px',
          marginLeft: '40px',
        });
      }
    }
  }, [selectedStatus]);




  return (
    <TableContainer component={Paper} className="table-container">
      <div className="filters">
        <Tabs
          value={statuses.indexOf(selectedStatus)}
          onChange={handleStatusChange}
          variant="scrollable"
          scrollButtons="auto"
          ref={tabsRef}
          TabIndicatorProps={{ style: indicatorStyle }}
        >
          {statuses.map(status => (
            <Tab
              key={status}
              label={
                <span className={`tab-label ${selectedStatus === status ? 'selected-tab' : ''}`}>
                  {status}
                  <span className="tab-label-number">
                    {requests.filter(row => row.requeststatus && row.requeststatus.toLowerCase() === status.toLowerCase()).length}
                  </span>
                </span>
              }
            />
          ))}
        </Tabs>
        <TextField
          select
          value={selectedDays}
          onChange={handleDaysChange}
          variant="outlined"
          size="small"
          style={{ marginLeft: '20px', height: '30px', backgroundColor: "white", width: '105px', marginRight: '-10px' }}
          InputProps={{
            style: { fontSize: '0.63rem' } // Decreasing the font size here
          }}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 300, // Optional: you can limit the max height of the dropdown
                width: '100px' // You can adjust this to control the width of the dropdown
              }
            }
          }}
        >
          {daysOptions.map(option => (
            <MenuItem key={option} value={option} style={{ fontSize: '0.75rem', padding: '5px 10px' }}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </div>
      <Table>
        <TableHead>
          <TableRow className="table-head">
            <TableCell>Req No:</TableCell>
            <TableCell>Project</TableCell>
            <TableCell>Learners</TableCell>
            <TableCell>Objective</TableCell>
            <TableCell>Tech Stack</TableCell>
            <TableCell>Requested On</TableCell>
            <TableCell>Status</TableCell>
            <TableCell></TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
  {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
    const { text, color } = mapStatusToDisplayText(row.requeststatus);  // Map status to custom text and color
    return (
      <TableRow key={index}>
        <TableCell>{row.requestid}</TableCell> {/* Assuming requestid is the unique identifier */}

        {/* Display the project name or new prospect name */}
        <TableCell  style={{ 
    
    wordWrap: "break-word",  // Ensure long words break and wrap
    whiteSpace: "normal",    // Allow text to wrap
   
    textAlign:"justify"      // Adjust the max width of the cell as needed
  }}>{row.newprospectname || row.project_name}</TableCell>  {/* Passing projectid and newprospectname */}

        <TableCell>{row.learners !== undefined && row.learners !== null ? row.learners : 0}</TableCell> {/* Ensure learners value exists */}
        <TableCell  style={{ 
   
    wordWrap: "break-word",  // Ensure long words break and wrap
    whiteSpace: "normal",    // Allow text to wrap
   
  }}>{row.trainingobj_name || "No Objective"}</TableCell>
        <TableCell>{row.techstack_name || "No Tech Stack"}</TableCell>
        <TableCell>{formatDate(row.createddate) || "No Date"}</TableCell>

        <TableCell 
          style={{ 
            color: color, 
            // wordWrap: "break-word",  // Enable word wrapping
            whiteSpace: "normal",    // Allow text to wrap
            maxWidth: "150px",       // Adjust the max width of the cell
          }}
        >
          {text}
        </TableCell> {/* Display the mapped text with color */}

        <TableCell>{`${row.completedLearners !== undefined && row.completedLearners !== null ? row.completedLearners : 0}/${row.learners !== undefined && row.learners !== null ? row.learners : 0} Completed`}</TableCell>
        <TableCell>
  <IconButton onClick={() => handleArrowClick(row.status)}>
    <ArrowCircleRightOutlinedIcon style={{ height: "20px" }} />
  </IconButton>

  {/* Edit icon conditionally rendered based on the role and status */}
  {/* {role === "requester" && (row.status === "SPOC Approval Awaited") && (
    <IconButton onClick={() => handleArrowClick("SPOC Approval Awaited")}>
      <EditIcon style={{ height: "15px" }} />
    </IconButton>
  )} */}

  {/* New condition for CapDev and Spoc roles with "SPOC Approval Awaited" status */}
  {(role === "CapDev" || role === "spoc") && row.requeststatus && row.requeststatus.toLowerCase() === "approval requested" && (
  <IconButton onClick={() => handleEditClick(row.requeststatus, row.requestid)}>
    <EditIcon style={{ height: "15px" }} />
  </IconButton>
)}
{console.log('Role:', role)}
{console.log('Request Status:', row.requeststatus)}

  {/* Other conditions */}
  {role === "requester" && row.status === "Clarification Requested" && (
    <IconButton onClick={() => handleMessageClick(row.status)}>
      <Badge
        badgeContent={"1 new"}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          '& .MuiBadge-badge': {
            fontSize: '8px',
            height: '12px',
            minWidth: '12px',
            padding: '0 4px',
            backgroundColor: '#FFDAB9',
            color: 'black',
            border: '1px solid #707070',
            top: '5px',
            right: '-5px',
          },
        }}
      >
        <ChatBubbleOutlineIcon />
      </Badge>
    </IconButton>
  )}
</TableCell>


      </TableRow>
    );
  })}
</TableBody>

      </Table>
      <TablePagination
        rowsPerPageOptions={[5]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        sx={{ display: 'flex', justifyContent: 'flex-start' }}
      />
    </TableContainer>
  );
};

RequestTable.propTypes = {
  roleId: PropTypes.number.isRequired,
};

export default RequestTable;
















































































































































// import { useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TablePagination, TextField, MenuItem } from "@mui/material";
// import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
// import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
// import Badge from '@mui/material/Badge';
// import AuthContext from "../Auth/AuthContext";
// import "../Training/RequestTable.css";

// const RequestTable = ({ roleId }) => {
//   const navigate = useNavigate();
//   const [page, setPage] = useState(0);
//   const rowsPerPage = 5;
//   const [requests, setRequests] = useState([]); // state for holding requests
//   const { user } = useContext(AuthContext); // Get the user from AuthContext

//   // Handle pagination
//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//  // Fetch data from API
// useEffect(() => {
//   if (user) {
//     fetch('http://localhost:8000/api/training-requests')
//       .then(response => response.json())
//       .then(data => {
//         console.log('Fetched data:', data); // Print data to console
        
//         // Check if roleId is 10 or 4
//         if (roleId === 10 || roleId === 4) {
//           // If roleId is 10 or 4, show all requests
//           setRequests(data.data);  // Set all requests in the state
//         } else {
//           // If roleId is not 10 or 4, filter requests created by the logged-in user
//           const userRequests = data.data.filter(request => request.requestonbehalfof === user.emp_id); // Adjust based on your data structure
//           setRequests(userRequests);  // Set filtered requests in the state
//         }
//       })
//       .catch(error => console.error('Error fetching data:', error));
//   }
// }, [user, roleId]);
//   return (
//     <TableContainer component={Paper} className="table-container">
//       <Table>
//         <TableHead>
//           <TableRow className="table-head">
//             <TableCell>Req No:</TableCell>
//             <TableCell>Project</TableCell>
//             <TableCell>Learners</TableCell>
//             <TableCell>Objective</TableCell>
//             <TableCell>Tech Stack</TableCell>
//             <TableCell>Requested On</TableCell>
//             <TableCell>Status</TableCell>
//             <TableCell>Completion Status</TableCell>
//             <TableCell>Actions</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {/* Displaying raw response data directly */}
//           {requests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
//             <TableRow key={index}>
//               <TableCell>{row.requestid}</TableCell> {/* Assuming requestid is the unique identifier */}
//               <TableCell>{row.project || "No Project"}</TableCell>
//               <TableCell>{row.learners || 0}</TableCell> {/* Ensure learners value exists */}
//               <TableCell>{row.trainingobj || "No Objective"}</TableCell>
//               <TableCell>{row.techStack || "No Tech Stack"}</TableCell>
//               <TableCell>{row.createddate || "No Date"}</TableCell>
//               <TableCell>{row.requeststatus || "No Status"}</TableCell> {/* Displaying raw status */}
//               <TableCell>{`${row.completedLearners || 0}/${row.learners || 0} Completed`}</TableCell>
//               <TableCell>
//                 <IconButton onClick={() => navigate(`/initiate-training`)}><ArrowCircleRightOutlinedIcon style={{ height: "20px" }} /></IconButton>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//       <TablePagination
//         rowsPerPageOptions={[5]}
//         component="div"
//         count={requests.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         sx={{ display: 'flex', justifyContent: 'flex-start' }}
//       />
//     </TableContainer>
//   );
// };

// export default RequestTable;
