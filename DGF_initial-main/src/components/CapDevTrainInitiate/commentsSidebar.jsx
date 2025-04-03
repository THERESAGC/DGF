import  { useState,useContext, useEffect } from "react";
import {Avatar, Drawer, Typography, Box, Tabs, Tab, TextField, FormControl, IconButton, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import PropTypes from 'prop-types';
import AuthContext from "../Auth/AuthContext";
import { arrayBufferToBase64 } from "../../utils/ImgConveter"
import formatDate from "../../utils/dateUtils"
import CapdevReminder from "./CapdevReminder";
import { backendUrl } from "../../../config/config";
const CommentsSidebar = ({ open, onClose, assignmentId}) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [newMessage, setNewMessage] = useState("");
  const { user } = useContext(AuthContext);
  const [popupOpen, setPopupOpen] = useState(false);
  const[comments,setComments] = useState([]);
  const [userProfiles, setUserProfiles] = useState({})
  const handleClosePopup = () => setPopupOpen(false);
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    
  };


    const fetchData = async () => {
        try{           
 const commentsResponse = await fetch(`${backendUrl}api/training-comment?assignment_id=${assignmentId}`); 
 const commentsData = await commentsResponse.json(); // Call json() once

    setComments(commentsData);
    console.log("Fetched Comments:", commentsData);

    const userIds = new Set()
    commentsData.forEach((comment) => {
              if (comment.created_by) userIds.add(comment.created_by)
            })
    
            const profiles = {}
            for (const userId of userIds) {
              const userResponse = await fetch(`${backendUrl}api/getempdetails/getEmpbasedOnId/${userId}`)
              const userData = await userResponse.json()
              console.log(`User Data for ${userId}:`, userData)
              if (userData && userData.length > 0) {
                if (userData[0]?.profile_image?.data) {
                  const base64Image = `data:image/jpeg;base64,${arrayBufferToBase64(userData[0].profile_image.data)}`
                  userData[0].profile_image = base64Image
                }
                profiles[userId] = userData[0]
              } else {
                profiles[userId] = { emp_name: "Unknown", profile_image: "/default-avatar.png" }
              }
            }
            setUserProfiles(profiles)
    
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
useEffect(() => {
if (open) {
    fetchData();
  }
}, [open, assignmentId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
        setPopupOpen(true);
       }
    else {
      // Replace with your API endpoint and request details
      const commentdata = {
        assignment_id: assignmentId,
        comment_text: newMessage,
        created_by: user.emp_id,
        created_date: new Date().toISOString(),
      };
console.log(commentdata);
      try {
        const response = await fetch(`${backendUrl}api/training-comment/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(commentdata),
        });

        if (response.ok) {
          console.log("Training Comment Added Successfully");
          setNewMessage("");
          fetchData();
        } else {
          console.error("Error adding  Training comment:", await response.json());
        }
      } catch (err) {
        console.error("Error adding comment:", err);
      }
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 300, p: 2 }}>
        <Tabs value={tabIndex} onChange={handleTabChange} aria-label="comments and reminders tabs">
          <Tab label="Comments" />
          <Tab label="Reminders" />
        </Tabs>
        {tabIndex === 0 && (
          <Box sx={{ p: 2 }}>
            <FormControl fullWidth style={{ marginBottom: "1rem", position: "relative" }}>
              <TextField
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                margin="normal"
                value={newMessage}
                placeholder="Add your comments here"
                onChange={(e) => setNewMessage(e.target.value)}
                InputProps={{
                  style: { fontSize: '12px', backgroundColor: '#ffffff', padding: '10px', minHeight: '100px' },
                }}
              />
              <IconButton
                onClick={handleSendMessage}
                style={{
                  position: "absolute",
                  bottom: 10,
                  right: 0,
                  transform: "rotate(315deg)",
                }}
              >
                <SendIcon  />
              </IconButton>
            </FormControl>
            <Box display="flex" flexDirection="column" gap={2}  >
                    {comments.length > 0 ? (
                      comments.map((comment) => {
                        return (
                          <div key={comment.comment_id} className="user-profile" style={{ marginBottom: "16px" }}>
                            <div
                              className="avatar-name"
                              style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
                            >
                              {/* Display Avatar for created_by */}
                              <Avatar
                                alt="User"
                                src={userProfiles[comment.created_by]?.profile_image || "/default-avatar.png"}
                                style={{ marginRight: "8px" }}
                              />
                              {/* Display User Name for created_by */}
                              <Typography className="typography-value-upper">
                                {userProfiles[comment.created_by]?.emp_name || "Unknown"}
                              </Typography>
                            </div>
                            {/* Display Comment Text */}
                            <Typography className="typography-value-upper" style={{ marginBottom: "8px" }}>
                              {comment.comment_text}
                            </Typography>
                            {/* Display the Created Date */}
                            <Typography className="typography-label-upper" style={{ fontSize: "0.85rem" }}>
                              {formatDate(comment.created_date)}
                            </Typography>
                          </div>
                        )
                      })
                    ) : (
                      <Typography></Typography>
                    )}
                  </Box>
           
          </Box>
        )}
         {tabIndex === 1 && (
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <CapdevReminder assignmentId={assignmentId} />
          </Box>
        )}
      </Box>
      <Dialog open={popupOpen} onClose={handleClosePopup}>
            <DialogTitle>Missing Comments</DialogTitle>
            <DialogContent>Please add comments before submitting.</DialogContent>
            <DialogActions>
              <Button onClick={handleClosePopup} color="primary">
                OK
              </Button>
            </DialogActions>
          </Dialog>
    </Drawer>
     
  );
};
CommentsSidebar.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  
  assignmentId: PropTypes.string.isRequired,
};


export default CommentsSidebar;