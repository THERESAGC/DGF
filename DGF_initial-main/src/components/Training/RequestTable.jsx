import { arrayBufferToBase64 } from '../../utils/ImgConveter';
import { useState, useRef, useEffect ,useContext, useCallback} from "react";
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import {Avatar, Box,Table, TableBody, TableCell, TableContainer, TableHead, TableRow,Popover, Paper, IconButton, TablePagination, Tabs, Tab, TextField, MenuItem, Typography, Pagination } from "@mui/material";
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import "../Training/RequestTable.css";
import getRoleType from '../../utils/roleUtils';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import Badge from '@mui/material/Badge';
import AuthContext from "../Auth/AuthContext";
import formatDate from "../../utils/dateUtils";
import DownloadReport from "../Training/DownloadReport";

const statuses = ["In Progress", "Completed", "Incomplete", "Rejected", "Suspended"];
const daysOptions = ["Last 7 days", "Last 30 days", "Last 90 days", "All"];
 
 
 
const RequestTable = ({ roleId }) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("In Progress");
  const [selectedDays, setSelectedDays] = useState("Last 30 days");
  const rowsPerPage = 5;
  const tabsRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const { user } = useContext(AuthContext); // Get the user from AuthContext
  const role = getRoleType(roleId);
  const [requests, setRequests] = useState([]); // state for holding requests
  const [learnersData, setLearnersData] = useState({}); // store learner images and count by request id
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [completionStatus, setCompletionStatus] = useState({});
  const [assignedToData, setAssignedToData] = useState({});
  const [assignedToOptions, setAssignedToOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null); // To control popover visibility
  const [selectedRequestId, setSelectedRequestId] = useState(null); // Track the requestId of the row clicked
  
  /*-------------------------------------*/
const excludedStatuses = [
  "rejected",
  "approval requested",
  "clarification requested",
  "preparing learning plan",
  "spoc approved",
  "capdev approved"
];
 
//fetch learners data
const fetchLearnerData = useCallback((requestId) => {
  fetch(`http://localhost:8000/api/getEmpNewTrainingRequested/getEmpNewTrainingRequested?requestid=${requestId}`)
    .then(response => response.json())
    .then(data => {
      console.log(data, "Learner data fetched successfully"); // Log the entire response
      if (data && data.employees && data.employees.length) {
        const learnerImages = data.employees.slice(0, 2).map(learner => {
          if (learner.profile_image && learner.profile_image.data) {
            const base64String = `data:image/jpeg;base64,${arrayBufferToBase64(learner.profile_image.data)}`;
            return base64String;
          }
          return "/path/to/default/avatar.jpg"; // Fallback if no image available
        });
        const totalLearners = data.employees.length; // Get total count of learners

        // Use prevState to update the learnersData
        setLearnersData(prevState => ({
          ...prevState, // Spread the previous state to avoid overwriting it
          [requestId]: { learnerImages, totalLearners, rawData: data.employees }
        }));
      }
    })
    .catch(error => console.error('Error fetching learner data:', error));
}, []);
console.log("Learners Data: avaialble", learnersData);

// Fetch completion data
const fetchCompletionData = useCallback((requestId) => {
  fetch(`http://localhost:8000/api/employee-completion-status/${requestId}`)
    .then(response => response.json())
    .then(data => {
      if (data && data.length) {
        const { totalEmployees, completedEmployees } = data[0];
        setCompletionStatus(prevState => ({
          ...prevState,
          [requestId]: { totalEmployees, completedEmployees }
        }));
      }
    })
    .catch(error => console.error('Error fetching completion data:', error));
}, []);
console.log("Completion Status:", completionStatus);

// Convert learner profile image to base64 when raw data changes
useEffect(() => {
  console.log('Learners Data Before Update:', learnersData);
  const updatedLearners = Object.keys(learnersData).map(requestId => {
    const learnersInfo = learnersData[requestId];
    if (learnersInfo.rawData && learnersInfo.rawData.length > 0) {
      const updatedLearnersData = learnersInfo.rawData.map(learner => {
        if (learner.profile_image && learner.profile_image.data) {
          const base64Flag = `data:image/jpeg;base64,${arrayBufferToBase64(learner.profile_image.data)}`;
          return { ...learner, profile_image: base64Flag };
        }
        return learner;
      });

      console.log(`Updated Learners for Request ${requestId}:`, updatedLearnersData);
      return {
        ...learnersInfo,
        rawData: updatedLearnersData,
      };
    }
    return learnersInfo;
  });

  const updatedLearnersData = updatedLearners.reduce((acc, learnerInfo, index) => {
    acc[Object.keys(learnersData)[index]] = learnerInfo;
    return acc;
  }, {});

  console.log('Updated Learners Data:', updatedLearnersData);

  if (JSON.stringify(updatedLearnersData) !== JSON.stringify(learnersData)) {
    setLearnersData(updatedLearnersData);
  }
}, [learnersData]);
 
 
 
  // Handle status tab change
  const handleStatusChange = (event, newValue) => {
    setSelectedStatus(statuses[newValue]);
    setPage(1);
  };
// Add the handleDaysChange function
const handleDaysChange = (event) => {
  setSelectedDays(event.target.value);
  setPage(1);
};
 
// Sort requests by createddate
const sortRequestsByDate = (requests) => {
  return requests.sort((a, b) => new Date(b.createddate) - new Date(a.createddate));
};
 
// Filter requests based on selected days
const filterRequestsByDays = (requests, selectedDays) => {
  const now = new Date();
  let filteredRequests = requests;
 
  if (selectedDays === "Last 7 days") {
    const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
    filteredRequests = requests.filter(request => new Date(request.createddate) >= sevenDaysAgo);
  } else if (selectedDays === "Last 30 days") {
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
    filteredRequests = requests.filter(request => new Date(request.createddate) >= thirtyDaysAgo);
  } else if (selectedDays === "Last 90 days") {
    const ninetyDaysAgo = new Date(now.setDate(now.getDate() - 90));
    filteredRequests = requests.filter(request => new Date(request.createddate) >= ninetyDaysAgo);
  }
 
  return filteredRequests;
};
 
// Update the useEffect to fetch and sort the requests
useEffect(() => {
  if (user) {
    fetch('http://localhost:8000/api/training-requests')
      .then(response => response.json())
      .then(data => {
        console.log("Fetched Data:", data); // Log the entire response
       
        let sortedRequests = sortRequestsByDate(data || []);
        if (roleId === 10 || roleId === 4) {
          setRequests(sortedRequests); 
          const initialAssignedData = data.reduce((acc, request) => {
            if (request.assignedToId && request.assignedToName) {
              acc[request.requestid] = {
                assignedToId: request.assignedToId,
                assignedToName: request.assignedToName,
              };
            }
            return acc;
          }, {});// Set sorted requests directly if the role matches
          setAssignedToData(initialAssignedData);
        } else {
          const userRequests = sortedRequests.filter(request => request.requestonbehalfof === user.emp_id);
          setRequests(userRequests);
          const initialAssignedData = data.reduce((acc, request) => {
            if (request.assignedToId && request.assignedToName) {
              acc[request.requestid] = {
                assignedToId: request.assignedToId,
                assignedToName: request.assignedToName,
              };
            }
            return acc;
          }, {});
          setAssignedToData(initialAssignedData);
        }

        fetch('http://localhost:8000/api/emp/getEmpsforCapdev')
          .then((response) => response.json())
          .then((empData) => {
            const formattedData = empData.map((member) => ({
              value: member.emp_id,
              label: member.name,
            }));
            setAssignedToOptions(formattedData);
            setLoading(false);
          })
          .catch((error) => {
            console.error('Error fetching employee options:', error);
            setLoading(false);
          });
       
      })
      .catch(error => console.error('Error fetching data:', error));

    
    }
} , [user, roleId]);
 
// Open the popover when clicking on the table cell
const handleClick = (event, requestId) => {
  setSelectedRequestId(requestId);
  setAnchorEl(event.currentTarget);
};

// Close the popover
const handleClose = () => {
  setAnchorEl(null);
};

// Update the assigned employee in the backend
const updateRequestWithAssignedTo = (emp_id, requestid) => {
  return fetch('http://localhost:8000/api/getemp/updateAssignedTo', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ requestid, emp_id }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Request updated successfully:', data);
    })
    .catch((error) => {
      console.error('Error updating request:', error);
    });
};

// Handle the selection of employee from the popover
const handleEmployeeSelect = (employeeId, requestId) => {
  setAssignedToData((prevData) => ({
    ...prevData,
    [requestId]: {
      assignedToId: employeeId,
      assignedToName: assignedToOptions.find((opt) => opt.value === employeeId).label,
    },
  }));

  handleClose(); // Close the popover after selection

  // Send the updated assigned employee to the backend
  updateRequestWithAssignedTo(employeeId, requestId).then(() => {
    // Refetch the data after updating the assignment
    fetch('http://localhost:8000/api/training-requests')
      .then((response) => response.json())
      .then((data) => {
        let sortedRequests = sortRequestsByDate(data || []);
        setRequests(sortedRequests);
        const initialAssignedData = data.reduce((acc, request) => {
          if (request.assignedToId && request.assignedToName) {
            acc[request.requestid] = {
              assignedToId: request.assignedToId,
              assignedToName: request.assignedToName,
            };
          }
          return acc;
        }, {});
        setAssignedToData(initialAssignedData);
      })
      .catch((error) => console.error('Error fetching request data:', error));
  });
};

// Updated function to map request status to custom display text and styling
const mapStatusToDisplayText = (status) => {
  switch (status.toLowerCase()) {
    case "approval requested":
      return { text: ["SPOC Approval ", "Awaited"], color: "#AA1700" };
    case "spoc approved":
      if (roleId === 4 ) {
        return { text: ["Initiate Learning"], color: "#06819E" };
      }
      return { text: ["Preparing Learning Plan"], color: "#AA1700" }
    case "capdev approved":
      if (roleId === 4 ) {
        return { text: ["Initiate Learning"], color: "#06819E" };
      }
      return { text: ["Preparing Learning Plan"], color: "#AA1700" };
    case "clarification requested":
      if (roleId === 4 || roleId ===10) {
        return { text: ["Clarification Awaited"], color: "#AA1700" };
      }
      return{ text: ["Clarification Requested"], color: "#AA1700" };
   
    case "initiate learning":
      return { text: ["Preparing", "Learning Plan"], color: "#AA1700" };
    case "learning initiated":
      return { text: ["Learning", " In Progress"], color: "#06819E" };
    case "learning suspended":
      return { text: ["Learning Suspended"], color: "#9F5603" };
    case "spoc approval awaited":
      if (role === "CapDev" || role === "Spoc") {
        return { text: ["Approval Requested"], color: "#AA1700" };
      }
      return { text: ["SPOC Approval Awaited"], color: "#AA1700" };
    case "rejected":
      return { text: ["Rejected"], color: "#9F5603" }; // Ensure "Rejected" status is handled
    case "incomplete":
          return{ text: ["Incomplete"], color: "#9F5603" }; // Ensure "Incomplete" status is handled
    case "completed with delay":
         return{ text: ["Completed With Delay"], color: "#9F5603" }; // Ensure "Completed with Delay" status is handled
    case "partially completed":
          return{ text: ["Partially Completed"], color: "#9F5603"}; //Partially Completed" status is handled
    case "completed":
          return{ text: ["Completed"], color: "#2BB381"}; //Completed" status is handled
    case "learning in progress":
          return { text: ["Learning", " In Progress"], color: "#06819E" };        
      default:
      return { text: [status], color: "black" };
  }
};
 
// Update the filtering logic
const filteredData = filterRequestsByDays(requests, selectedDays).filter(row => {
  const status = row.requeststatus ? row.requeststatus.toLowerCase().trim() : "";
 
  if (selectedStatus === "In Progress") {
    const inProgressStatuses = [
      "approval requested",
      "spoc approved",
      "capdev approved",
      "initiate learning",
      "learning initiated",
      "clarification requested",
      "learning in progress"
    ];
    return inProgressStatuses.includes(status); // Returns true if status is part of "In Progress"
  } else if (selectedStatus === "Completed") {
    const completeStatuses = [
      "completed",
      "completed with delay",
      
    ];
    return completeStatuses.includes(status); // Filter for "completed"
  } else if (selectedStatus === "Incomplete") {
    return status === "incomplete"; // Filter for "incomplete"
  } else if (selectedStatus === "Rejected") {
    return status === "rejected"; // Filter for "rejected"
  } else if (selectedStatus === "Suspended") {
    return status === "learning suspended"; // Filter for "learning suspended"
  }
  return status === selectedStatus.toLowerCase().trim(); // Return the status if it matches the selected one
});
 
 
console.log('Filtered Data for Status:', selectedStatus, filteredData.length);
console.log('Filtered Data:', filteredData); // Check what's inside filteredData
 
useEffect(() => {
  if (requests.length > 0) {
  // Fetch learner data for each request ID when requests change
  requests.forEach(request => {
    fetchLearnerData(request.requestid);
    fetchCompletionData(request.requestid);
  });
}
}, [requests]);
 
// Log the `user` object
useEffect(() => {
  console.log("User object:", user); // Make sure user is not null and has emp_id
}, [user]);
 
// Navigate to different pages based on status
  const handleArrowClick = (status,requestId) => {
    if (status === "Initiate Training") {
      navigate(`/initiate-training`);
    }
 
    if (status === "clarification requested") {
      navigate(`/requester-information/${requestId}`);
    }

    if (status == 'Approval Requested'){
      navigate(`/requester-information/${requestId}`)
    }
   
    if (status == 'Learning In Progress'){
      navigate(`/requester-information/${requestId}`)
    }

    if (status == 'Completed' || status.toLowerCase() =='completed with delay'){
      navigate(`/requester-information/${requestId}`)
    }
    if (status.toLowerCase() == 'rejected'  || status.toLowerCase()=='learning suspended' || status.toLowerCase()=='incomplete'){
      navigate(`/requester-information/${requestId}`)
    }

    
  };
// hanlde Edit Click
const handleEditClick = (status,requestId) => {
  console.log('Status:', status);
  console.log('Request ID:', requestId);
 
  if (status === 'Learning In Progress') {
    navigate(`/learning-initiated-details/${requestId}`);
  }
  if(status === 'Learning Initiated'){
    navigate(`/learning-initiated-details/${requestId}`);
  }
  if (status === 'Approval Requested') {
    navigate(`/spoc-approval/${requestId}`);
  }
  if (status === 'spoc approved' || status === 'capdev approved') {
    navigate(`/initiate-learning-details/${requestId}`);
  }
  if (status == 'clarification requested'){
    navigate(`/requester-information/${requestId}`)
  }
 
}
 
  // Handle message click
  const handleMessageClick = (status, requestId) => {
    console.log('Status:', status);  // Check status value
    if(status === "clarification requested"){
      console.log('Clarification Requested clicked', requestId);
      navigate(`/clarification-requested/${requestId}`);
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
 
 // Handle download report - Excel format
 const handleDownloadReport = (startDate, endDate) => {
  console.log("Downloading Excel report for date range:", startDate, "to", endDate)

  // Filter requests based on date range
  const filteredByDate = requests.filter((request) => {
    const requestDate = new Date(request.createddate)
    return requestDate >= startDate && requestDate <= endDate
  })

  // Prepare data for Excel export
  const excelData = filteredByDate.map((row) => ({
    "Request ID": row.requestid,
    Project: row.newprospectname || row.project_name || "N/A",
    Objective: row.trainingobj_name || "No Objective",
    "Tech Stack": row.techstack_name || "No Tech Stack",
    "Created Date": formatDate(row.createddate) || "No Date",
    Status: row.requeststatus || "N/A",
    "Assigned To": row.assignedto_name || "Not Assigned",
    "Learners Count": learnersData[row.requestid]?.totalLearners || 0,
    Completed: completionStatus[row.requestid]?.completedEmployees || 0,
    "Total Employees": completionStatus[row.requestid]?.totalEmployees || 0,
  }))

  // Create a worksheet
  const worksheet = XLSX.utils.json_to_sheet(excelData)

  // Create a workbook
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Training Requests")

  // Generate Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })

  // Save to file
  const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })

  // Create download link
  const fileName = `training_requests_${formatDate(startDate)}_to_${formatDate(endDate)}.xlsx`

  // Create a download link and trigger the download
  const url = window.URL.createObjectURL(data)
  const link = document.createElement("a")
  link.href = url
  link.download = fileName
  link.click()

  // Clean up
  setTimeout(() => {
    window.URL.revokeObjectURL(url)
  }, 100)
}

 
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
  {statuses.map(status => {
    // Calculate the count of filtered data for the current status
    const count = requests.filter(row => {
      const statusInRow = row.requeststatus ? row.requeststatus.toLowerCase().trim() : "";
      if (status === "In Progress") {
        const inProgressStatuses = [
          "approval requested",
          "spoc approved",
          "capdev approved",
          "initiate learning",
          "learning initiated","clarification requested"
        ];
        return inProgressStatuses.includes(statusInRow);
      } else if (status === "Completed") {
        const completeStatuses = [
          "completed",
          "completed with delay",
          "partially completed"   ];
        return completeStatuses.includes(statusInRow);
     
      } else if (status === "Incomplete") {
        return statusInRow === "incomplete";
      } else if (status === "Rejected") {
        return statusInRow === "rejected";
      } else if (status === "Suspended") {
        return statusInRow === "learning suspended";
      }
      return statusInRow === status.toLowerCase().trim();
    }).length;
 
    return (
      <Tab
        key={status}
        label={
          <span className={`tab-label ${selectedStatus === status ? 'selected-tab' : ''}`}>
            {status}
            <span className="tab-label-number">
              {count} {/* Display the count */}
            </span>
          </span>
        }
      />
    );
  })}
</Tabs>

<div className="flex items-center ml-2 mr-2">
{user.role_id === 4 && <DownloadReport onDownload={handleDownloadReport} />}
        </div>
 
        <TextField
          select
          value={selectedDays}
          onChange={handleDaysChange}
          variant="outlined"
          size="small"
          style={{ marginLeft: '20px', height: '30px', backgroundColor: "white", width: '105px' }}
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
          <TableRow className="table-head">{console.log('All Requests:', requests)}
            <TableCell>Req No:</TableCell>
            <TableCell>Project</TableCell>
            <TableCell>Learners</TableCell>
            <TableCell>Objective</TableCell>
            <TableCell>Tech Stack</TableCell>
            <TableCell>Requested On</TableCell>
            <TableCell className="no">Status</TableCell>
            <TableCell></TableCell>
            <TableCell>Assigned To</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
  {filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((row, index) => {
    const { text, color } = mapStatusToDisplayText(row.requeststatus);
    return (
      <TableRow key={index}>
        <TableCell>#{row.requestid}</TableCell> {/* Assuming requestid is the unique identifier */}
        <TableCell style={{ wordWrap: "break-word", whiteSpace: "normal", textAlign: "justify" }}>
          {row.newprospectname || row.project_name}
        </TableCell>
        <TableCell>
  <Box display="flex" alignItems="center">
    {(learnersData[row.requestid]?.rawData || []).slice(0, 2).map((learner, i) => {
      const imageUrl = learner.profile_image ? learner.profile_image : "/path/to/default/avatar.jpg";  // Fallback if no image available
      return (
        <Avatar
          key={i}
          src={imageUrl}
          alt={`Learner ${i + 1}`}
          style={{ marginLeft: i === 1 ? -1.5 : 1 }}
        />
      );
    })}
    {(learnersData[row.requestid]?.totalLearners || 0) > 2 && (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        style={{
          backgroundColor: '#f0f0f0',
          borderRadius: '50%',
          width: 20,
          height: 20,
        }}
      >
        <Typography variant="body2">+{learnersData[row.requestid].totalLearners - 2}</Typography>
      </Box>
    )}
  </Box>
</TableCell>
        <TableCell style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>{row.trainingobj_name || "No Objective"}</TableCell>
        <TableCell style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>{row.techstack_name || "No Tech Stack"}</TableCell>
        <TableCell style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>{formatDate(row.createddate) || "No Date"}</TableCell>
        <TableCell style={{ color: color, whiteSpace: "normal", maxWidth: "150px" }}>{text}</TableCell>
        <TableCell>
  {!excludedStatuses.includes(row.requeststatus?.toLowerCase()) && completionStatus[row.requestid] && (
    `${completionStatus[row.requestid].completedEmployees || 0}/${completionStatus[row.requestid].totalEmployees || 0} Completed`
  )}
</TableCell>
        {(row.requeststatus && ["spoc approved", "capdev approved", "learning initiated", "completed", "incomplete", "completed with delay","learning in progress"].includes(row.requeststatus.toLowerCase())) ? (
          <TableCell onClick={(event) => handleClick(event, row.requestid)}>
            {row.assignedto_name}
          </TableCell>
        ) : (
          <TableCell></TableCell> // Placeholder cell to maintain column alignment
        )}
        {role === "CapDev" && (row.requeststatus && ["spoc approved", "capdev approved", "initiate learning", "learning initiated", "learning in progress"].includes(row.requeststatus.toLowerCase())) && (
          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
            PaperProps={{ style: { width: '112px', boxShadow: 'none', border: '1px solid #ccc', padding: '0px', marginTop: '-10px' } }}
          >
            <div style={{ padding: '10px' }}>
              {assignedToOptions.map((option) => (
                <div
                  key={option.value}
                  style={{ cursor: 'pointer', fontSize: '12px', borderBottom: '1px solid #ccc' }}
                  onClick={() => handleEmployeeSelect(option.value, selectedRequestId)}
                >
                  {option.label}
                </div>
              ))}
            </div>
          </Popover>
        )}
        <TableCell>
          {(role === "CapDev" || role === "spoc") && row.requeststatus && row.requeststatus.toLowerCase() === "approval requested" && (
            <IconButton onClick={() => handleEditClick(row.requeststatus, row.requestid)}>
              <ArrowCircleRightOutlinedIcon style={{ height: "20px" }} />
            </IconButton>
          )}
          {(role === "CapDev") && row.requeststatus && row.requeststatus.toLowerCase() === "spoc approved" && (
            <IconButton onClick={() => handleEditClick(row.requeststatus, row.requestid)}>
              <ArrowCircleRightOutlinedIcon style={{ height: "20px" }} />
            </IconButton>
          )}
          {(role === "CapDev") && row.requeststatus && row.requeststatus.toLowerCase() === "capdev approved" && (
            <IconButton onClick={() => handleEditClick(row.requeststatus, row.requestid)}>
              <ArrowCircleRightOutlinedIcon style={{ height: "20px" }} />
            </IconButton>
          )}
          {(role === "CapDev") && row.requeststatus && row.requeststatus.toLowerCase() === "learning in progress" && (
            <IconButton onClick={() => handleEditClick(row.requeststatus, row.requestid)}>
              <ArrowCircleRightOutlinedIcon style={{ height: "20px" }} />
            </IconButton>
          )}
          {(role === "CapDev") && row.requeststatus && row.requeststatus.toLowerCase() === "clarification requested" && (
            <IconButton onClick={() => handleEditClick(row.requeststatus, row.requestid)}>
              <ArrowCircleRightOutlinedIcon style={{ height: "20px" }} />
            </IconButton>
          )}
          {role === "requester" && (
            <IconButton onClick={() => handleArrowClick(row.requeststatus, row.requestid)}>
              <ArrowCircleRightOutlinedIcon style={{ height: "15px" }} />
            </IconButton>
          )}
           { (row.requeststatus.toLowerCase()==='completed'|| row.requeststatus.toLowerCase()==='completed with delay' || row.requeststatus.toLowerCase()==='rejected' || row.requeststatus.toLowerCase()==='learning suspended'|| row.requeststatus.toLowerCase()==='incomplete') && (
            <IconButton onClick={() => handleArrowClick(row.requeststatus, row.requestid)}>
              <ArrowCircleRightOutlinedIcon style={{ height: "20px" }} />
            </IconButton>
          )}
          {(role === "requester") && row.requeststatus && row.requeststatus.toLowerCase() === "clarification requested" && (
            <IconButton onClick={() => handleMessageClick(row.requeststatus, row.requestid)}>
              <Badge
                badgeContent={"1 new"}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
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
 
<Box sx={{
  display: "flex",
  justifyContent: "space-between",
  mt: 2,
  alignItems: "center"
}}>
  <Typography variant="body2" color="text.secondary">
    Showing {Math.min((page - 1) * rowsPerPage + 1, filteredData.length)}-{Math.min(page * rowsPerPage, filteredData.length)} of {filteredData.length} records
  </Typography>
  <Pagination
    count={Math.ceil(filteredData.length / rowsPerPage)} // Update this line
    page={page}
    onChange={(e, value) => setPage(value)}
    shape="rounded"
    color="primary"
    sx={{
      '& .MuiPaginationItem-root.Mui-selected': {
        color: 'red', // Change text color for selected page
        fontWeight: 'bold', // Optional: Change font weight,
        backgroundColor: 'transparent', // Optional: Remove background color
      },
      '& .MuiPaginationItem-root': {
        margin: '-1px', // Reduce the space between page numbers (adjust as necessary)
      },
    }}
  />
</Box>
    </TableContainer>
    
);
};
 
RequestTable.propTypes = {
roleId: PropTypes.number.isRequired,
onStatusCountChange: PropTypes.func.isRequired,
};
 
export default RequestTable;
