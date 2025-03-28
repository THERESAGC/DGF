
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
  MenuItem,
  Select,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DateCalendar } from "@mui/x-date-pickers";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EventIcon from "@mui/icons-material/Event";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PropTypes from "prop-types";

import { styled } from "@mui/material/styles";

// Define ReminderPaper
const ReminderPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  height: "100%",
  display: "flex",
  flexDirection: "column",
}));

const CapdevReminder = ({ assignmentId }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [reminderText, setReminderText] = useState("");
  const [reminders, setReminders] = useState({});
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [loading, setLoading] = useState(false);

  const [filterDays, setFilterDays] = useState(7); // Default filter for 7 days

  const createdBy = JSON.parse(localStorage.getItem("user"))?.emp_id;

  // Fetch reminders from the API when the component mounts or assignmentId changes
  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/reminders/date?assignment_id=${assignmentId}`);
        const remindersData = response.data;

        // Group reminders by date
        const groupedReminders = remindersData.reduce((acc, reminder) => {
          const date = reminder.reminder_date;
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push({
            id: reminder.reminder_id,
            text: reminder.reminder_text,
          });
          return acc;
        }, {});

        setReminders(groupedReminders);
      } catch (error) {
        console.error("Error fetching reminders:", error);
        setSnackbar({ open: true, message: "Failed to fetch reminders", severity: "error" });
      }
    };

    if (assignmentId) {
      fetchReminders();
    }
  }, [assignmentId]);

  useEffect(() => {
    updateUpcomingEvents();
  }, [reminders, filterDays]);

  const updateUpcomingEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const allEvents = [];
    Object.keys(reminders).forEach((dateStr) => {
      reminders[dateStr].forEach((reminder) => {
        const reminderDate = new Date(dateStr);
        const daysDifference = (reminderDate - today) / (1000 * 60 * 60 * 24);
        if (daysDifference >= 0 && daysDifference <= filterDays) {
          allEvents.push({
            date: reminderDate,
            text: reminder.text,
            isPast: reminderDate < today,
          });
        }
      });
    });

    allEvents.sort((a, b) => a.date - b.date);
    setUpcomingEvents(allEvents);
  };

  const isDateValid = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const saveReminder = async () => {
    if (!selectedDate) {
      setSnackbar({ open: true, message: "Please select a future date", severity: "error" });
      return;
    }
  
    if (!reminderText.trim()) {
      setSnackbar({ open: true, message: "Please enter reminder text", severity: "error" });
      return;
    }
  
    setLoading(true);
  
    try {
      const dateStr = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];
      const payload = {
        assignment_id: assignmentId,
        reminder_date: dateStr,
        reminder_text: reminderText,
        created_by: createdBy,
      };
  
      const response = await axios.post("http://localhost:8000/api/reminders", payload);
      console.log("New Reminder Response:", response.data);
      const newReminder = response.data;
  
      const updatedReminders = { ...reminders };
      if (!updatedReminders[dateStr]) {
        updatedReminders[dateStr] = [];
      }
      updatedReminders[dateStr].push({
        id: newReminder.reminder_id,
        text: newReminder.reminder_text || reminderText, // Fallback to reminderText
      });
  
      setReminders(updatedReminders);
      setReminderText("");
      setSnackbar({ open: true, message: "Reminder saved successfully", severity: "success" });
    } catch (error) {
      console.error("Error saving reminder:", error);
      setSnackbar({ open: true, message: "Failed to save reminder", severity: "error" });
    } finally {
      setLoading(false);
    }
  };
  const deleteReminder = async (dateStr, index, reminderId) => {
    try {
      await axios.delete(`http://localhost:8000/api/reminders/${reminderId}`);

      const updatedReminders = { ...reminders };
      updatedReminders[dateStr].splice(index, 1);

      if (updatedReminders[dateStr].length === 0) {
        delete updatedReminders[dateStr];
      }

      setReminders(updatedReminders);
      setSnackbar({ open: true, message: "Reminder deleted successfully", severity: "success" });
    } catch (error) {
      console.error("Error deleting reminder:", error);
      setSnackbar({ open: true, message: "Failed to delete reminder", severity: "error" });
    }
  };

 

  const formatDate = (dateStr) => {
    const options = { weekday: "short", month: "short", day: "numeric" };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleFilterChange = (event) => {
    setFilterDays(event.target.value);
  };

  const selectedDateStr = selectedDate ? selectedDate.toISOString().split("T")[0] : null;
  const selectedDateReminders = selectedDateStr && reminders[selectedDateStr] ? reminders[selectedDateStr] : [];

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", gap: 2, p: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 1, paddingTop: "10px" }}>
        <NotificationsIcon sx={{ mr: 1, color: "primary.main" }} />
        <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
          Select Date for Reminders
        </Typography>
      </Box>

      <ReminderPaper elevation={0}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateCalendar
            value={selectedDate}
            onChange={handleDateChange}
            disablePast
            sx={{
              width: "100%",
              "& .MuiPickersDay-root.Mui-selected": {
                backgroundColor: "primary.main",
                color: "white",
              },
            }}
          />
        </LocalizationProvider>
      </ReminderPaper>

      <ReminderPaper elevation={0}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, display: "flex", alignItems: "center", mb: 1 }}>
            <EventIcon sx={{ mr: 1, fontSize: "1rem", color: "primary.main" }} />
            {selectedDate ? formatDate(selectedDate) : "Select a date"}
          </Typography>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter your reminder"
            value={reminderText}
            onChange={(e) => setReminderText(e.target.value)}
            size="small"
            sx={{
              mb: 1,
              "& .MuiOutlinedInput-input::placeholder": {
                fontSize: "14px",
                fontFamily: "Poppins, sans-serif",
                color: "#9e9e9e",
              },
            }}
            disabled={!selectedDate || !isDateValid(selectedDate)}
          />

          <Button
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
            onClick={saveReminder}
            disabled={!selectedDate || !isDateValid(selectedDate) || !reminderText.trim() || loading}
            fullWidth
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Save Reminder
          </Button>
        </Box>

        {selectedDateReminders.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Reminders for {formatDate(selectedDateStr)}:
            </Typography>
            <List dense sx={{ bgcolor: "background.paper", borderRadius: "8px" }}>
              {selectedDateReminders.map((reminder, index) => (
                <ListItem
                  key={reminder.id}
                  secondaryAction={
                    <>
                      <IconButton edge="end" onClick={() => deleteReminder(selectedDateStr, index, reminder.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </>
                  }
                  sx={{ borderBottom: index < selectedDateReminders.length - 1 ? "1px solid #f0f0f0" : "none" }}
                >
                  <ListItemText primary={reminder.text} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </ReminderPaper>

      <Box sx={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, display: "flex", alignItems: "center" }}>
            <AccessTimeIcon sx={{ mr: 1, fontSize: "1rem", color: "primary.main" }} />
            Upcoming Events
          </Typography>
          <Select
            value={filterDays}
            onChange={handleFilterChange}
            size="small"
            sx={{ fontSize: "0.6rem", width: "105px", height: "30px", borderRadius: "8px", fontWeight: 400 }}
          >
            <MenuItem value={7}>Next 7 Days</MenuItem>
            <MenuItem value={15}>Next 15 Days</MenuItem>
            <MenuItem value={30}>Next 30 Days</MenuItem>
          </Select>
        </Box>

        <Box sx={{ flex: 1, overflow: "auto", pr: 1 }}>
          {upcomingEvents.length > 0 ? (
            <List sx={{ p: 0 }}>
              {upcomingEvents.map((event, index) => (
                <ListItem key={index} sx={{ borderBottom: "1px solid #f0f0f0" }}>
                  <ListItemText
                    primary={event.text}
                    secondary={formatDate(event.date)}
                    primaryTypographyProps={{
                      variant: "body2",
                      fontWeight: event.isPast ? 400 : 500,
                    }}
                    secondaryTypographyProps={{
                      variant: "caption",
                      sx: { display: "flex", alignItems: "center" },
                    }}
                  />
                  {!event.isPast && (
                    <Chip
                      label="Upcoming"
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ height: "20px", fontSize: "0.7rem" }}
                    />
                  )}
                </ListItem>
              ))}
            </List>
          ) : (
            <Alert severity="info" sx={{ borderRadius: "8px" }}>
              No reminders scheduled
            </Alert>
          )}
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

CapdevReminder.propTypes = {
  assignmentId: PropTypes.string.isRequired,
};

export default CapdevReminder;