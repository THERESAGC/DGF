import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Avatar,
  Button,
  Collapse,
  IconButton
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import "./InitiateTraining.css";
import AssignCourseModal from "./AssignCourseModal";

const InitiateTraining = () => {
  const [expandedDetails, setExpandedDetails] = useState(true);
  const [expandedTable, setExpandedTable] = useState(true);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedLearners, setSelectedLearners] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const learners = [
    { id: "HS5158", name: "Jonathon Russ", availableFrom: "15th Jan 2025", dailyBandwidth: "4hrs", weekend: "No", avatar: "https://i.pravatar.cc/40?img=1" },
    { id: "HS5333", name: "Joel Dowd", availableFrom: "15th Jan 2025", dailyBandwidth: "4hrs", weekend: "No", avatar: "https://i.pravatar.cc/40?img=2" },
    { id: "HS5455", name: "Alan Patel", availableFrom: "15th Jan 2025", dailyBandwidth: "4hrs", weekend: "No", avatar: "https://i.pravatar.cc/40?img=3" },
  ];

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedLearners([]);
    } else {
      setSelectedLearners(learners.map((learner) => learner.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectLearner = (id) => {
    setSelectedLearners((prevSelected) =>
      prevSelected.includes(id) ? prevSelected.filter((learnerId) => learnerId !== id) : [...prevSelected, id]
    );
  };
  const handleCancel = () => {
    // Handle cancel action
  };

  const handleSaveAndExit = () => {
    // Handle save and exit action
  };

  const handleSubmit = () => {
    // Handle submit action
  };

  const isSubmitDisabled = selectedLearners.length === 0;
  return (
    <div className="initiate-training-container">
    <Box className="training-container">
      {/* Training Details Section */}
      <Paper className="training-details-paper">
        <Box className="header-box">
          <Typography variant="h6">Training Details</Typography>
          <Typography variant="h6">Request ID: #1234</Typography>
          <Typography variant="h6">Requested by: Joe Maison</Typography>
          <Typography variant="h6">Project: Walmart</Typography>
          <IconButton onClick={() => setExpandedDetails(!expandedDetails)} className="collapse-button">
            {expandedDetails ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
        <Collapse in={expandedDetails}>
          <Box className="training-details-box">
            <Box>
              <Typography><b>Service Division:</b> Tech Services</Typography>
              <Typography><b>Primary Skills:</b> Programming Knowledge</Typography>
              <Typography><b>Other Skills:</b> Tech Services</Typography>
            </Box>
            <Box>
              <Typography><b>Request ID:</b> #1234</Typography>
              <Typography><b>Requested by:</b> Joe Maison</Typography>
              <Typography><b>Project:</b> Walmart</Typography>
            </Box>
            <Box>
              <Typography><b>Expected Completion:</b> 31st Jan 2025</Typography>
              <Typography><b>Techstack/Area:</b> Front-end</Typography>
            </Box>
          </Box>
        </Collapse>
      </Paper>

      {/* Assign Course to Learners Section */}
      <Paper className="assign-course-paper">
        <Box display="flex" justifyContent="space-between" alignItems="center" className="assign-course-header">
          <Box display="flex" alignItems="center" className="assign-course-header-box">
            <Typography variant="h6">Assign Course to Learners</Typography> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            <Typography className="assign-course-typography">3 Learners are allocated to this training request</Typography>
          </Box>
          <IconButton onClick={() => setExpandedTable(!expandedTable)} className="collapse-button">
            {expandedTable ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
        <Collapse in={expandedTable}>
          <Box className="bulk-assign-button-container"  > 
          <Button variant="contained" className="bulk-assign-button" disabled={selectedLearners.length === 0} onClick={() => setOpenModal(true)}>
                Assign Course
              </Button>
          </Box>
          <TableContainer component={Paper} className="-container">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><Checkbox checked={selectAll} onChange={handleSelectAll} /></TableCell>
                  <TableCell><b>Employee ID</b></TableCell>
                  <TableCell><b>Name</b></TableCell>
                  <TableCell><b>Available From</b></TableCell>
                  <TableCell><b>Daily Bandwidth</b></TableCell>
                  <TableCell><b>Available on <br />Weekend?</b></TableCell>
                  <TableCell><b>Actions</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {learners.map((learner) => (
                  <TableRow key={learner.id}>
                    <TableCell>
                      <Checkbox checked={selectedLearners.includes(learner.id)} onChange={() => handleSelectLearner(learner.id)} />
                    </TableCell>
                    <TableCell>{learner.id}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar src={learner.avatar} className="assign-course-avatar" />
                        {learner.name}
                      </Box>
                    </TableCell>
                    <TableCell>{learner.availableFrom}</TableCell>
                    <TableCell>{learner.dailyBandwidth}</TableCell>
                    <TableCell>{learner.weekend}</TableCell>
                    <TableCell>
                    <Button variant="contained" className="assign-course-button" onClick={() => setOpenModal(true)}>
                          Assign Course
                        </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Collapse>
      </Paper>
    </Box>
    <Box className="action-buttons">
            <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
            <Button variant="outlined" onClick={handleSaveAndExit}>Save & Exit</Button>
            <Button variant="contained" onClick={handleSubmit} disabled={isSubmitDisabled}>Submit</Button>
          </Box>
          <AssignCourseModal open={openModal} onClose={() => setOpenModal(false)} />
    </div>
  );
};

export default InitiateTraining;