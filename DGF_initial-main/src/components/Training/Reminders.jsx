
import { useState, useEffect, useContext } from "react"
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
  TableSortLabel,
  Tooltip,
  Card,
  CardContent,
  Divider,
  Pagination,
  styled,
  CircularProgress,
} from "@mui/material"
import axios from "axios"
import AuthContext from "../Auth/AuthContext"
import { format, startOfWeek, addDays, isToday } from "date-fns"
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
// Styled components for consistent design
const StyledTableCell = styled(TableCell)({
  fontFamily: "inherit",
  fontWeight: "bold",
  padding: "16px",
})
const StyledTableRow = styled(TableRow)(({ index }) => ({
  backgroundColor: index % 2 === 0 ? "#F1F2FD" : "white",
  "&:hover": {
    backgroundColor: "rgba(143, 190, 248, 0.08)",
  },
}))

const StyledCard = styled(Card)(({ isToday }) => ({
  minWidth: 200,
  mr: 2,
  boxShadow: isToday ? "0 4px 12px rgba(25, 118, 210, 0.3)" : "0 2px 8px rgba(0, 0, 0, 0.1)",
  border: isToday ? "2px solid #8FBEF8" : "1px solid #e0e0e0",
  backgroundColor: isToday ? "rgba(241, 242, 253, 0.7)" : "white",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
  },
}))

const StyledTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
  ({
    [`& .MuiTooltip-tooltip`]: {
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      color: "#333",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      borderRadius: "8px",
      padding: "12px 16px",
      maxWidth: 320,
      border: "1px solid #e0e0e0",
    },
    [`& .MuiTooltip-arrow`]: {
      color: "rgba(255, 255, 255, 0.95)",
    },
  }),
)

const ReminderItem = styled(Typography)( ({
  marginTop: "8px",
  padding: "10px",
  backgroundColor: "rgba(241, 242, 253, 0.7)",
  borderRadius: "8px",
  cursor: "pointer",
  border: "1px solid rgba(143, 190, 248, 0.3)",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: "rgba(143, 190, 248, 0.2)",
    transform: "translateY(-2px)",
  },
}))

const SectionTitle = styled(Typography)(({
  fontWeight: "bold",
  marginBottom: "16px",
  position: "relative",
  paddingBottom: "8px",
  "&:after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "40px",
    height: "3px",
    backgroundColor: "#8FBEF8",
  },
}))

const Reminders = () => {
  const { user } = useContext(AuthContext)
  const [reminders, setReminders] = useState([])
  const [weeklyReminders, setWeeklyReminders] = useState([])
  const [allReminders, setAllReminders] = useState([])
  // const [reminderDetailsMap, setReminderDetailsMap] = useState({})
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [order, setOrder] = useState("desc")
  const [orderBy, setOrderBy] = useState("last_notified")
  const [loading, setLoading] = useState(true)

  // Get the current week dates (5 business days)
  const getWeekDays = () => {
    const startDate = startOfWeek(new Date(), { weekStartsOn: 1 }) // Start from Monday
    const weekDays = []

    for (let i = 0; i < 5; i++) {
      // Monday to Friday
      const day = addDays(startDate, i)
      weekDays.push({
        date: day,
        formattedDate: format(day, "EEE, MMM d"),
        reminders: [],
      })
    }

    return weekDays
  }

  useEffect(() => {
    const fetchYourReminders = async () => {
      try {
        setLoading(true)
        // Fetch reminders created by the logged-in user
        const response = await axios.get(`http://localhost:8000/api/reminders/emp`, {
          params: { emp_id: user.emp_id },

        })
          
       console.log("Response:", response.data)

        if (Array.isArray(response.data)) {
          const fetchedReminders = response.data

          // Process weekly reminders
          const weekDays = getWeekDays()

          // Filter reminders for the current week and group by date
          fetchedReminders.forEach((reminder) => {
            const reminderDate = new Date(reminder.reminder_date)

            weekDays.forEach((day) => {
              if (format(reminderDate, "yyyy-MM-dd") === format(day.date, "yyyy-MM-dd")) {
                day.reminders.push(reminder)
              }
            })
          })

          setWeeklyReminders(weekDays)
          setReminders(fetchedReminders)
        } else {
          console.log("No reminders found")
        }
        setLoading(false)
      } catch (error) {
        console.error("Error fetching your reminders:", error)
        setLoading(false)
      }
    }

    const fetchAllReminders = async () => {
      try {
        setLoading(true)
        // Fetch all reminders using the new API endpoint
        const response = await axios.get("http://localhost:8000/api/reminders", {
          params: { emp_id: user.emp_id, role_id: user.role_id },
        })
    
        if (Array.isArray(response.data)) {
          const validReminders = response.data.filter((reminder) => {
            const reminderDate = new Date(reminder.last_notified)
            if (isNaN(reminderDate)) {
              console.warn(`Invalid last_notified date: ${reminder.last_notified}`)
              return false // Exclude invalid dates
            }
            return true // Include valid dates
          })
    
          setAllReminders(validReminders)
          console.log("All reminders:", validReminders)
        } else {
          console.log("No reminders found")
        }
        setLoading(false)
      } catch (error) {
        console.error("Error fetching all reminders:", error)
        setLoading(false)
      }
    }

    if (user && user.emp_id) {
      fetchYourReminders()
      fetchAllReminders()
    }
  }, [user])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc"
    setOrder(isAsc ? "desc" : "asc")
    setOrderBy(property)
  }

  const createSortHandler = (property) => () => {
    handleRequestSort(property)
  }

  // Sort function
  const sortedReminders = allReminders.sort((a, b) => {
    const aValue = a[orderBy]
    const bValue = b[orderBy]

    if (order === "asc") {
      if (orderBy === "last_notified") {
        return new Date(aValue) - new Date(bValue)
      }
      return aValue < bValue ? -1 : 1
    } else {
      if (orderBy === "last_notified") {
        return new Date(bValue) - new Date(aValue)
      }
      return bValue < aValue ? -1 : 1
    }
  })

  // Calculate pagination values
  const startIndex = page * rowsPerPage + 1
  const endIndex = Math.min((page + 1) * rowsPerPage, allReminders.length)

  // Custom tooltip content renderer
  const renderTooltipContent = (reminder) => {
    return (
      <Box sx={{ p: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
          Reminder Details
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            Employee:
          </Typography>
          <Typography variant="body2">{reminder.emp_name || "N/A"}</Typography>

          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            Course:
          </Typography>
          <Typography variant="body2">{reminder.course_name || "N/A"}</Typography>

          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            Request ID:
          </Typography>
          <Typography variant="body2">{reminder.requestid || "N/A"}</Typography>
        </Box>
      </Box>
    )
 
  }

  return (
    <Box sx={{ width: "100%", mt: 2, px: 3 }}>
      {/* Weekly Reminders Section */}
      {user?.role_id === 4 && (
        <>
      <SectionTitle variant="h6" sx={{ml:"13px"}}>Your Reminders for this week !</SectionTitle>

      <Box
        sx={{
          display: "flex",
          overflowX: "auto",
          mb: 4,
          pb: 1,
          "&::-webkit-scrollbar": {
            height: "8px",
            scrollBehavior: "smooth",
            display: "none",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#c1c1c1",
            borderRadius: "10px",
            "&:hover": {
              backgroundColor: "#a1a1a1",
            },
          },
        }}
      >
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", width: "100%", py: 4 }}>
            <CircularProgress size={40} sx={{ color: "#8FBEF8" }} />
          </Box>
        ) : (
          weeklyReminders.map((day, index) => (
            <StyledCard
              key={index}
              isToday={isToday(day.date)}
              sx={{
                minWidth: 200,
                mr: 2,
                boxShadow: isToday(day.date) ? "0 4px 12px rgba(25, 118, 210, 0.3)" : "0 2px 8px rgba(0, 0, 0, 0.1)",
                border: isToday(day.date) ? "2px solid #8FBEF8" : "1px solid #e0e0e0",
                backgroundColor: isToday(day.date) ? "rgba(241, 242, 253, 0.7)" : "white",
              }}
            >
              <CardContent>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: "bold",
                    mb: 1,
                    color: isToday(day.date) ? "#1976d2" : "inherit",
                  }}
                >
                  {day.formattedDate}
                  {isToday(day.date) && (
                    <Typography component="span" sx={{ ml: 1, fontSize: "0.75rem", color: "#2BB381" }}>
                      (Today)
                    </Typography>
                  )}
                </Typography>
                <Divider sx={{ mb: 1.5 }} />
                {day.reminders.length > 0 ? (
                  day.reminders.map((reminder, idx) => (
                    <StyledTooltip
                      key={idx}
                      title={renderTooltipContent(reminder)}
                      arrow
                      placement="top"
                      enterDelay={500}
                      leaveDelay={200}
                    >
                      <ReminderItem variant="body2">{reminder.reminder_text}</ReminderItem>
                    </StyledTooltip>
                  ))
                ) : (
                  <Typography variant="body2" sx={{ mt: 1, color: "text.secondary", fontStyle: "italic" }}>
                    No reminders
                  </Typography>
                )}
              </CardContent>
            </StyledCard>
          ))
        )}
      </Box>
</>
      )}
      {/* Reminders Table Section */}
      <SectionTitle variant="h6" sx={{ml:"13px"}}>All Email Reminders</SectionTitle>

      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          borderRadius: "15px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="reminders table">
            <TableHead>
              <TableRow sx={{ borderBottom: "2px solid #8FBEF8" }}>
              <StyledTableCell>
  <TableSortLabel
    active={orderBy === "request_id"}
    direction={orderBy === "request_id" ? order : "asc"}
    onClick={createSortHandler("request_id")}
    IconComponent={orderBy === "request_id" && order === "asc" ? KeyboardArrowUpIcon : KeyboardArrowDownIcon} // Add the arrow icons
  >
    Request ID
  </TableSortLabel>
</StyledTableCell>
<StyledTableCell>
  <TableSortLabel
    active={orderBy === "employee_name"}
    direction={orderBy === "employee_name" ? order : "asc"}
    onClick={createSortHandler("employee_name")}
    IconComponent={orderBy === "employee_name" && order === "asc" ? KeyboardArrowUpIcon : KeyboardArrowDownIcon}
  >
    Employee Name
  </TableSortLabel>
</StyledTableCell>
<StyledTableCell>
      <div onClick={createSortHandler("course_name")} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
        <span>Course Name</span>
        {orderBy === "course_name" && (
          order === "asc" ? (
            <KeyboardArrowDownIcon style={{ marginLeft: 8 }} />
          ) : (
            <KeyboardArrowUpIcon style={{ marginLeft: 8 }} />
          )
        )}
      </div>
    </StyledTableCell>
                <StyledTableCell>
                  <TableSortLabel
                    active={orderBy === "last_notified"}
                    direction={orderBy === "last_notified" ? order : "asc"}
                    onClick={createSortHandler("last_notified")}
                  >
                    Last Notified
                  </TableSortLabel>
                </StyledTableCell>
                <StyledTableCell>
                  <TableSortLabel
                    active={orderBy === "notified_by"}
                    direction={orderBy === "notified_by" ? order : "asc"}
                    onClick={createSortHandler("notified_by")}
                  >
                    Notified By
                  </TableSortLabel>
                </StyledTableCell>
                <StyledTableCell>
                  <TableSortLabel
                    active={orderBy === "reminder_count"}
                    direction={orderBy === "reminder_count" ? order : "asc"}
                    onClick={createSortHandler("reminder_count")}
                  >
                    Reminder Count
                  </TableSortLabel>
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={40} sx={{ color: "#8FBEF8" }} />
                  </TableCell>
                </TableRow>
              ) : sortedReminders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary" sx={{mt: 3}}>
                      No reminders found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                sortedReminders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((reminder, index) => (
                  <StyledTableRow key={reminder.emailreminder_id} index={index}>
                    <TableCell sx={{ fontFamily: "inherit" }}>{reminder.request_id}</TableCell>
                    <TableCell sx={{ fontFamily: "inherit" }}>{reminder.employee_name || "N/A"}</TableCell>
                    <TableCell sx={{ fontFamily: "inherit" }}>{reminder.course_name || "N/A"}</TableCell>
                    <TableCell sx={{ fontFamily: "inherit" }}>
                      {new Date(reminder.last_notified).toLocaleString()}
                    </TableCell>
                    <TableCell sx={{ fontFamily: "inherit" }}>{reminder.notified_by}</TableCell>
                    <TableCell sx={{ fontFamily: "inherit" }}>
                      <Box
                        sx={{
                          display: "inline-block",
                          backgroundColor:
                            reminder.reminder_count > 2 ? "rgba(170, 23, 0, 0.1)" : "rgba(43, 179, 129, 0.1)",
                          borderRadius: "12px",
                          px: 1.5,
                          py: 0.5,
                        }}
                      >
                        <Typography
                          sx={{
                            color: reminder.reminder_count > 2 ? "#AA1700" : "#2BB381",
                            fontSize: "0.875rem",
                            fontWeight: "medium",
                          }}
                        >
                          {reminder.reminder_count}
                        </Typography>
                      </Box>
                    </TableCell>
                  </StyledTableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            borderTop: "1px solid rgba(224, 224, 224, 1)",
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "inherit" }}>
            {allReminders.length === 0
              ? "No records"
              : `Showing ${startIndex}-${endIndex} of ${allReminders.length} records`}
          </Typography>
          <Pagination
            count={Math.ceil(allReminders.length / rowsPerPage)}
            page={page + 1}
            onChange={(e, newPage) => handleChangePage(e, newPage - 1)}
            size="small"
            shape="rounded"
            sx={{
              "& .MuiPaginationItem-root": {
                fontFamily: "inherit",
              },
              "& .Mui-selected": {
                backgroundColor: "rgba(143, 190, 248, 0.2)",
                color: "#1976d2",
                "&:hover": {
                  backgroundColor: "rgba(143, 190, 248, 0.3)",
                },
              },
            }}
          />
        </Box>
      </Paper>
    </Box>
  )
}

export default Reminders

