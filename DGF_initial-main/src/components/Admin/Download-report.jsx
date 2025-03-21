import { useState } from "react"
import { Box, Typography, Button, Stack, Paper, TextField } from "@mui/material"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
 
const DownloadReport = () => {
  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)
 
  const handleClear = () => {
    setFromDate(null)
    setToDate(null)
  }
 
  const handleExport = () => {
    console.log("Exporting report from", fromDate, "to", toDate)
    // Add your export logic here
  }
 
  const isDateRangeSelected = fromDate !== null && toDate !== null
 
  return (
    <Paper elevation={3} sx={{ p: 4,height:"400px", mx: "auto", mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        Export Report
      </Typography>
 
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Stack spacing={3}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <DatePicker
              label="From"
              value={fromDate}
              onChange={(newValue) => setFromDate(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: "outlined",
                },
              }}
            />
 
            <DatePicker
              label="To"
              value={toDate}
              onChange={(newValue) => setToDate(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: "outlined",
                },
              }}
              minDate={fromDate}
            />
          </Box>
        </Stack>
      </LocalizationProvider>
 
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
      <Button
              variant="outlined"
              size="small"
              onClick={handleClear}
              sx={{
                padding: "6px 10px ",
                fontSize: "12px",
                color: "#1976d2",
                borderColor: "#1976d2",
                textTransform: "none",
                fontFamily: "Poppins",
                "&:hover": {
                  backgroundColor: "#e3f2fd",
                  borderColor: "#1976d2",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleExport}
              disabled={!isDateRangeSelected}
              sx={{
                padding: "6px 10px",
                fontSize: "12px",
                backgroundColor: "#09459E",
                textTransform: "none",
                fontFamily: "Poppins",
                "&:hover": {
                  backgroundColor: "#1565c0",
                },
              }}
            >
              Download
            </Button>
 
 
       
      </Box>
    </Paper>
  )
}
 
export default DownloadReport
 