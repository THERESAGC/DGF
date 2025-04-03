import { useState } from "react"
import { Box, Tabs, Tab, Paper } from "@mui/material"
// import DownloadReport from "./Download-report"
import EffectivenessReport from "./EffectivenessReport"
import { backendUrl } from "../../../config/config"

const ReportsManagement = () => {
  const [tabValue, setTabValue] = useState(0)
 
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }
 
  const getIndicatorStyle = (tabValue) => {
    switch (tabValue) {
      case 0:
        return { marginLeft: "25px" }
      case 1:
        return { marginLeft: "40px" }
      default:
        return { marginLeft: "30px" }
    }
  }
 
  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        borderRadius: "15px",
        opacity: 1,
        padding: 3,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        transition: "min-height 0.3s ease",
        fontFamily: '"Poppins", sans-serif',
      }}
    >
      <Paper elevation={0} sx={{ mb: 4, borderRadius: "10px", overflow: "hidden" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            borderBottom: "1px solid #e0e0e0",
            "& .MuiTabs-indicator": {
              backgroundColor: "#FA5864",
              height: "3px",
              width: "40px !important",
              ...getIndicatorStyle(tabValue),
            },
            "& .Mui-selected": {
              color: "#09459E !important",
              fontWeight: "500",
            },
          }}
        >
          <Tab
            label="Learning Program Report"
            sx={{
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: "400",
              minWidth: "120px",
            }}
          />
          <Tab
            label="Effectiveness Report"
            sx={{
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: "400",
              minWidth: "120px",
            }}
          />
        </Tabs>
 
        <Box sx={{ p: 0 }}>
          {tabValue === 0 && <DownloadReport />}
          {tabValue === 1 && <EffectivenessReport />}
        </Box>
      </Paper>
    </Box>
  )
}
 
export default ReportsManagement