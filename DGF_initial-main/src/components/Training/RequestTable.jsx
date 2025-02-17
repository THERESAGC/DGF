import { useState } from "react";
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Typography, IconButton, TablePagination, Tabs, Tab, TextField, MenuItem, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import "../Training/RequestTable.css";
 
// Define the getRoleType function directly in this file
const getRoleType = (roleId) => {
  if (roleId === 10) {
    return 'spoc';
  } else if (roleId === 4) {
    return 'CapDev';
  } else {
    return 'requester';
  }
};
 
const data = [
  { id: "123", project: "iAlign", learners: 5, completedLearners: 3, objective: "Upskilling", techStack: "Accessibility", requestedOn: "Jan 20, 2025", status: "Learning in Progress" },
  { id: "231", project: "Staffing Nation", learners: 5, completedLearners: 2, objective: "Upskilling", techStack: "React", requestedOn: "Jan 20, 2025", status: "SPOC Approval Awaited" },
  { id: "321", project: "Other Project Name", learners: 3, completedLearners: 0, objective: "Upskilling", techStack: "Soft Skills", requestedOn: "Jan 15, 2025", status: "Preparing Learning Plan" },
  { id: "322", project: "Another Project", learners: 4, completedLearners: 4, objective: "Upskilling", techStack: "Python", requestedOn: "Jan 8, 2025", status: "Completed" },
  { id: "323", project: "Yet Another Project", learners: 3, completedLearners: 1, objective: "Upskilling", techStack: "Node.js", requestedOn: "Jan 5, 2025", status: "Clarification Awaited" },
  { id: "324", project: "Hold Project", learners: 2, completedLearners: 0, objective: "Upskilling", techStack: "Java", requestedOn: "Jan 2, 2025", status: "Hold" },
  { id: "325", project: "New Project", learners: 6, completedLearners: 6, objective: "Upskilling", techStack: "Angular", requestedOn: "Jan 10, 2025", status: "Partially Completed" },
  { id: "326", project: "Old Project", learners: 7, completedLearners: 5, objective: "Upskilling", techStack: "Vue.js", requestedOn: "Jan 12, 2025", status: "Completed with Delay" },
  { id: "327", project: "Future Project", learners: 8, completedLearners: 8, objective: "Upskilling", techStack: "React Native", requestedOn: "Jan 14, 2025", status: "Completed" },
  { id: "328", project: "Past Project", learners: 4, completedLearners: 3, objective: "Upskilling", techStack: "Django", requestedOn: "Jan 16, 2025", status: "Partially Completed" },
  { id: "329", project: "Incomplete Project 1", learners: 5, completedLearners: 2, objective: "Upskilling", techStack: "JavaScript", requestedOn: "Jan 18, 2025", status: "Incomplete" },
  { id: "330", project: "Incomplete Project 2", learners: 6, completedLearners: 3, objective: "Upskilling", techStack: "TypeScript", requestedOn: "Jan 19, 2025", status: "Incomplete" },
  { id: "331", project: "Rejected Project 1", learners: 4, completedLearners: 1, objective: "Upskilling", techStack: "Ruby", requestedOn: "Jan 21, 2025", status: "Rejected" },
  { id: "332", project: "Rejected Project 2", learners: 3, completedLearners: 0, objective: "Upskilling", techStack: "Go", requestedOn: "Jan 22, 2025", status: "Rejected" },
  { id: "333", project: "Hold Project 2", learners: 5, completedLearners: 2, objective: "Upskilling", techStack: "Swift", requestedOn: "Jan 23, 2025", status: "Hold" },
  { id: "001", project: "iAl", learners: 5, completedLearners: 3, objective: "Upskilling", techStack: "Accessibility", requestedOn: "Jan 20, 2025", status: "Approval Requested" },
  { id: "002", project: "Sonia", learners: 5, completedLearners: 3, objective: "Upskilling", techStack: "Accessibility", requestedOn: "Jan 20, 2025", status: "Initiate Training" },
  { id: "002", project: "Sonia", learners: 5, completedLearners: 3, objective: "Upskilling", techStack: "Accessibility", requestedOn: "Jan 20, 2025", status: "Initiate Training" },
  { id: "002", project: "Sonia", learners: 5, completedLearners: 3, objective: "Upskilling", techStack: "Accessibility", requestedOn: "Jan 20, 2025", status: "Initiate Training" },
  { id: "002", project: "Sonia", learners: 5, completedLearners: 3, objective: "Upskilling", techStack: "Accessibility", requestedOn: "Jan 20, 2025", status: "Initiate Training" }
];
 
const requesterInProgressStatuses = ["SPOC Approval Awaited", "Learning in Progress", "Preparing Learning Plan", "Clarification Awaited"];
const spocInProgressStatuses = ["Approval Requested", "Preparing Learning Plan", "Learning in Progress", "Clarification Awaited"];
const capDevInProgressStatuses = ["Initiate Training", "Approval Requested", "Preparing Learning Plan", "Learning in Progress", "Clarification Awaited"];
const completedStatuses = ["Completed", "Partially Completed", "Completed with Delay"];
const statuses = ["In Progress", "Completed", "Incomplete", "Rejected", "Hold"];
const daysOptions = ["Last 7 days", "Last 30 days", "Last 90 days", "All"];
 
const RequestTable = ({ roleId }) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState("In Progress");
  const [selectedDays, setSelectedDays] = useState("All");
  const rowsPerPage = 5;
 
  const role = getRoleType(roleId);
 
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
 
  const handleStatusChange = (event, newValue) => {
    setSelectedStatus(statuses[newValue]);
    setPage(0);
  };
 
  const handleDaysChange = (event) => {
    setSelectedDays(event.target.value);
    setPage(0);
  };
 
  const getInProgressStatuses = () => {
    if (role === "spoc") {
      return spocInProgressStatuses;
    } else if (role === "CapDev") {
      return capDevInProgressStatuses;
    } else {
      return requesterInProgressStatuses;
    }
  };
 
  const filteredData = data.filter(row => {
    if (selectedStatus === "In Progress") {
      return getInProgressStatuses().includes(row.status);
    } else if (selectedStatus === "Completed") {
      return completedStatuses.includes(row.status);
    } else if (selectedStatus === "Incomplete") {
      return row.status === "Incomplete";
    } else if (selectedStatus === "Rejected") {
      return row.status === "Rejected";
    } else if (selectedStatus === "Hold") {
      return row.status === "Hold";
    }
    return row.status === selectedStatus;
  });
 
  const handleArrowClick = (status) => {
    if (status === "Initiate Training") {
      navigate('/initiate-training');
    }
    if (status === 'Approval Requested') {
      navigate('/spoc-approval');
    }
  }
 
  return (
    <TableContainer component={Paper} className="table-container">
  <div className="filters">
    <Tabs value={statuses.indexOf(selectedStatus)} onChange={handleStatusChange} variant="scrollable" scrollButtons="auto">
      {statuses.map(status => (
           <Tab
           key={status}
           label={
             <span className="tab-label">
               {status}
               <span className="tab-label-number">
                 {data.filter(row => {
                   if (status === "In Progress") {
                     return getInProgressStatuses().includes(row.status);
                   } else if (status === "Completed") {
                     return completedStatuses.includes(row.status);
                   } else if (status === "Incomplete") {
                     return row.status === "Incomplete";
                   } else if (status === "Rejected") {
                     return row.status === "Rejected";
                   } else if (status === "Hold") {
                     return row.status === "Hold";
                   }
                   return row.status === status;
                 }).length}
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
  style={{ marginLeft: '20px', height: '30px', backgroundColor: "white", width: '105px', marginRight:'-10px' }}
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
        <TableCell >Project</TableCell>
        <TableCell>Learners</TableCell>
        <TableCell>Objective</TableCell>
        <TableCell>Tech Stack</TableCell>
        <TableCell>Requested On</TableCell>
        <TableCell className="no">Status</TableCell>
        <TableCell > </TableCell> {/* New Column */}
        <TableCell>Actions</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
        <TableRow key={index}>
          <TableCell>{row.id}</TableCell>
          <TableCell className="project">{row.project}</TableCell>
          <TableCell>
            <Box display="flex" alignItems="center">
              {Array.from({ length: Math.min(row.learners, 2) }).map((_, i) => (
                <Avatar key={i} style={{ marginLeft: i === 1 ? -1.5: 1 }}>{row.learners}</Avatar>
              ))}
              {row.learners > 2 && (
                <Box display="flex" alignItems="center" justifyContent="center" style={{ marginLeft:0, backgroundColor: '#f0f0f0', borderRadius: '50%', width: 20, height: 20 }}>
                  <Typography variant="body2">+{row.learners - 2}</Typography>
                </Box>
              )}
            </Box>
          </TableCell>
          <TableCell>{row.objective}</TableCell>
          <TableCell>{row.techStack}</TableCell>
          <TableCell>{row.requestedOn}</TableCell>
          <TableCell>
            <Typography color={row.status.includes("Progress") || completedStatuses.includes(row.status) || row.status === "Incomplete" ? "primary" : "textSecondary"}>
              {row.status}
            </Typography>
          </TableCell>
          <TableCell>
            {/* New Column for Completion Status */}
            {row.status === "Learning in Progress" || completedStatuses.includes(row.status) || row.status === "Incomplete" ?
              `${row.completedLearners}/${row.learners} Completed` : ""}
          </TableCell>
          <TableCell>
            <IconButton onClick={() => handleArrowClick(row.status)}><ArrowCircleRightOutlinedIcon style={{height:"20px"}} /></IconButton>
            {role === "requester" && (row.status === "SPOC Approval Awaited" || row.status === "Clarification Awaited") && (
              <IconButton><EditIcon style={{height:"15px"}} /></IconButton>
            )}
            {role === "CapDev" && row.status === "Clarification Awaited" && (
              <IconButton><EditIcon style={{height:"15px"}} /></IconButton>
            )}
            {role !== "requester" && role !== "CapDev" && row.status === "Clarification Awaited" && (
              <IconButton><EditIcon style={{height:"15px"}} /></IconButton>
            )}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
  <TablePagination
    rowsPerPageOptions={[5]}
    component="div"
    count={filteredData.length}
    rowsPerPage={rowsPerPage}
    page={page}
    onPageChange={handleChangePage}
  />
 
</TableContainer>
 
  );
};
 
RequestTable.propTypes = {
  roleId: PropTypes.number.isRequired,
};
 
export default RequestTable;