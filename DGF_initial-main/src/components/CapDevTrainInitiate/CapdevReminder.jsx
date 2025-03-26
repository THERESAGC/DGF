import { useState, useEffect } from "react";
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
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EventIcon from "@mui/icons-material/Event";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const ReminderPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  height: "100%",
  display: "flex",
  flexDirection: "column",
}));

const UpcomingEventItem = styled(ListItem)(({ theme, isPast }) => ({
  borderRadius: "8px",
  marginBottom: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  textDecoration: isPast ? "line-through" : "none",
  opacity: isPast ? 0.6 : 1,
}));

const CapdevReminder = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [reminderText, setReminderText] = useState("");
  const [reminders, setReminders] = useState({});
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState({ isEditing: false, dateStr: null, index: null });
  const [filterDays, setFilterDays] = useState(7); // Default filter for 7 days

  useEffect(() => {
    const savedReminders = localStorage.getItem("capdevReminders");
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders));
    }
  }, []);

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
            text: reminder,
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

  const saveReminder = () => {
    if (!selectedDate) {
      setSnackbar({ open: true, message: "Please select a future date", severity: "error" });
      return;
    }

    if (!isDateValid(selectedDate)) {
      setSnackbar({ open: true, message: "Cannot set reminders for today or past dates", severity: "error" });
      return;
    }

    if (!reminderText.trim()) {
      setSnackbar({ open: true, message: "Please enter reminder text", severity: "error" });
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const dateStr = selectedDate.toISOString().split("T")[0];
      const updatedReminders = { ...reminders };

      if (!updatedReminders[dateStr]) {
        updatedReminders[dateStr] = [];
      }

      if (editMode.isEditing) {
        updatedReminders[editMode.dateStr][editMode.index] = reminderText;
        setEditMode({ isEditing: false, dateStr: null, index: null });
      } else {
        updatedReminders[dateStr].push(reminderText);
      }

      setReminders(updatedReminders);
      localStorage.setItem("capdevReminders", JSON.stringify(updatedReminders));

      setReminderText("");
      setSnackbar({ open: true, message: "Reminder saved successfully", severity: "success" });
      setLoading(false);
    }, 500);
  };

  const deleteReminder = (dateStr, index) => {
    const updatedReminders = { ...reminders };
    updatedReminders[dateStr].splice(index, 1);

    if (updatedReminders[dateStr].length === 0) {
      delete updatedReminders[dateStr];
    }

    setReminders(updatedReminders);
    localStorage.setItem("capdevReminders", JSON.stringify(updatedReminders));

    setSnackbar({ open: true, message: "Reminder deleted successfully", severity: "success" });
  };

  const editReminder = (dateStr, index, text) => {
    setSelectedDate(new Date(dateStr));
    setReminderText(text);
    setEditMode({ isEditing: true, dateStr, index });
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
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 , paddingTop: "10px"}}>
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
            sx={{ mb: 1 , "& .MuiOutlinedInput-input::placeholder": {
      fontSize: "14px", // Adjust the font size
      fontFamily: "Poppins, sans-serif", // Adjust the font family
      color: "#9e9e9e", // Optional: Adjust placeholder color
    },}}
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
            {editMode.isEditing ? "Update Reminder" : loading ? "Saving..." : "Save Reminder"}
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
                  key={index}
                  secondaryAction={
                    <>
                      <IconButton edge="end" onClick={() => editReminder(selectedDateStr, index, reminder)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton edge="end" onClick={() => deleteReminder(selectedDateStr, index)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </>
                  }
                  sx={{ borderBottom: index < selectedDateReminders.length - 1 ? "1px solid #f0f0f0" : "none" }}
                >
                  <ListItemText primary={reminder} />
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
            sx={{ fontSize: "0.6rem", width: "105px",height: "30px", borderRadius: "8px", fontWeight: 400, marginRight: "8px" }}
              MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 300, // Optional: you can limit the max height of the dropdown
                            width: '100px' ,// You can adjust this to control the width of the dropdown,
                        
                          }
                        }
                      }}
          >
            <MenuItem  style={{ fontSize: '0.75rem', padding: '5px 10px' }} value={7}>Next 7 Days</MenuItem>
            <MenuItem  style={{ fontSize: '0.75rem', padding: '5px 10px' }} value={15}>Next 15 Days</MenuItem>
            <MenuItem  style={{ fontSize: '0.75rem', padding: '5px 10px' }}value={30}>Next 30 Days</MenuItem>
          </Select>
          
        </Box>

        <Box sx={{ flex: 1, overflow: "auto", pr: 1 }}>
          {upcomingEvents.length > 0 ? (
            <List sx={{ p: 0 }}>
              {upcomingEvents.map((event, index) => (
                <UpcomingEventItem key={index} isPast={event.isPast}>
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
                </UpcomingEventItem>
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

export default CapdevReminder;