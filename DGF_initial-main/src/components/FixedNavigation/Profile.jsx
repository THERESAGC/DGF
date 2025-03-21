// Desc: Profile page for the user

import { useState, useEffect, useContext } from "react"
import {
  Container,
  Typography,
  Grid,
  Box,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  useTheme,
} from "@mui/material"
import EmailIcon from "@mui/icons-material/Email"
import BadgeIcon from "@mui/icons-material/Badge"
import WorkIcon from "@mui/icons-material/Work"
import PersonIcon from "@mui/icons-material/Person"
import SecurityIcon from "@mui/icons-material/Security"
import BusinessIcon from "@mui/icons-material/Business"
import axios from "axios"
import AuthContext from "../Auth/AuthContext"
import { arrayBufferToBase64 } from "../../utils/ImgConveter"
import { toPascalCase } from "../../utils/stringUtils"

const Profile = () => {
  const [profileDetails, setProfileDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useContext(AuthContext)
  const [profileImage, setProfileImage] = useState("")
  const theme = useTheme()

  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`http://localhost:8000/api/profiles/${user.emp_id}`)
        setProfileDetails(response.data)

        // Handle profile image
        if (response.data.profile_image && response.data.profile_image.data) {
          const base64Flag = `data:image/jpeg;base64,${arrayBufferToBase64(response.data.profile_image.data)}`
          setProfileImage(base64Flag)
        } else if (user && user.profile_image && user.profile_image.data) {
          const base64Flag = `data:image/jpeg;base64,${arrayBufferToBase64(user.profile_image.data)}`
          setProfileImage(base64Flag)
        }

        setLoading(false)
      } catch (err) {
        console.error("Error fetching profile details:", err)
        setError("Failed to load profile information. Please try again later.")
        setLoading(false)
      }
    }

    if (user && user.emp_id) {
      fetchProfileDetails()
    }
  }, [user])

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    )
  }

  if (!profileDetails) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <Typography variant="h6">No profile information available</Typography>
      </Box>
    )
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        paddingTop: "2rem",
        paddingBottom: "4rem",
        overflowY: "hidden",
      }}
    >
      <Grid container spacing={4}>
        {/* Right column - Detailed Information */}
        <Grid item xs={12}>
          <Card
            elevation={3}
            sx={{
              borderRadius: "12px",
              width: "100%",
            height: '400px',
            minHeight: '400px',
            overflow: 'hidden',
            // backgroundColor: theme.palette.mode === "light" ? "#f4f6f8" : "#1c2023",
            
            }}
          >
            <CardContent>
              <Grid container spacing={4}>
                {/* Personal Information */}
                <Grid item xs={12} md={6} flexBasis="49.5% !important"> 
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      marginBottom: "1rem",
                      color: "#333",
                    
                    }}
                  >
                    Personal Information
                  </Typography>

                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <PersonIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            Full Name
                          </Typography>
                        }
                        secondary={toPascalCase(profileDetails.emp_name)}
                      />
                    </ListItem>

                    <ListItem>
                      <ListItemIcon>
                        <EmailIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            Email Address
                          </Typography>
                        }
                        secondary={profileDetails.emp_email}
                      />
                    </ListItem>

                    <ListItem>
                      <ListItemIcon>
                        <BadgeIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            Employee ID
                          </Typography>
                        }
                        secondary={profileDetails.emp_id}
                      />
                    </ListItem>
                  </List>
                </Grid>

                <Divider orientation="vertical" flexItem sx={{height:'400px'}} />

                {/* Professional Information */}
                <Grid item xs={12} md={6} >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      marginBottom: "1rem",
                      color: "#333",
                    
                    }}
                  >
                    Professional Information
                  </Typography>

                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <WorkIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            Designation
                          </Typography>
                        }
                        secondary={profileDetails.Designation_Name}
                      />
                    </ListItem>

                    <ListItem>
                      <ListItemIcon>
                        <SecurityIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            System Role
                          </Typography>
                        }
                        secondary={profileDetails.system_role}
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>

              {profileDetails.department && (
                <>
                  <Divider sx={{ margin: "1.5rem 0" }} />

                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      marginBottom: "1rem",
                      color: "#333",
                    }}
                  >
                    Department Information
                  </Typography>

                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <BusinessIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            Department
                          </Typography>
                        }
                        secondary={profileDetails.department}
                      />
                    </ListItem>
                  </List>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Profile