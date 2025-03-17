"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  Paper,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Pagination,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  Fab,
  Snackbar,
  Alert,
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import SearchIcon from "@mui/icons-material/Search"
import ViewListIcon from "@mui/icons-material/ViewList"
import GridViewIcon from "@mui/icons-material/GridView"
import SortIcon from "@mui/icons-material/Sort"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import CodeIcon from "@mui/icons-material/Code"
import axios from "axios"

const RequestFormEditor = () => {
  const [tabValue, setTabValue] = useState(0)
  const [projects, setProjects] = useState([])
  const [serviceDivisions, setServiceDivisions] = useState([])
  const [techStacks, setTechStacks] = useState([])
  const [primarySkills, setPrimarySkills] = useState([])

  const [isAddProjectDialogOpen, setIsAddProjectDialogOpen] = useState(false)
  const [isAddDivisionDialogOpen, setIsAddDivisionDialogOpen] = useState(false)
  const [isAddTechStackDialogOpen, setIsAddTechStackDialogOpen] = useState(false)
  const [isAddPrimarySkillDialogOpen, setIsAddPrimarySkillDialogOpen] = useState(false)

  const [newProjectName, setNewProjectName] = useState("")
  const [newDivisionName, setNewDivisionName] = useState("")
  const [newTechStackName, setNewTechStackName] = useState("")
  const [newPrimarySkillName, setNewPrimarySkillName] = useState("")
  const [selectedTechStackId, setSelectedTechStackId] = useState("")

  const [editItem, setEditItem] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)

  const [searchTerm, setSearchTerm] = useState("")
  const [skillSearchTerm, setSkillSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState("list")
  const [sortOrder, setSortOrder] = useState("asc")
  const [projectCategory, setProjectCategory] = useState("all")
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [newProjectCategory, setNewProjectCategory] = useState("")
  const [expandedTechStack, setExpandedTechStack] = useState(null)

  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" })

  const itemsPerPage = 5

  useEffect(() => {
    fetchProjects()
    fetchServiceDivisions()
    fetchTechStacks()
  }, [])

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const response = await axios.get("http://localhost:8000/api/project/all")
      const projectsData = response.data.map((project) => ({
        id: project.ProjectID,
        name: project.ProjectName,
      }))
      setProjects(projectsData)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching projects:", error)
      setLoading(false)
    }
  }

  const fetchServiceDivisions = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/services")
      const serviceDivisionsData = response.data.services.map((service) => ({
        id: service.id,
        name: service.service_name,
      }))
      setServiceDivisions(serviceDivisionsData)
    } catch (error) {
      console.error("Error fetching service divisions:", error)
    }
  }

  const fetchTechStacks = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/techstack/all")
      const techStacksData = response.data.map((stack) => ({
        id: stack.stack_id,
        name: stack.stack_name,
      }))
      setTechStacks(techStacksData)
    } catch (error) {
      console.error("Error fetching tech stacks:", error)
    }
  }

  const fetchPrimarySkills = async (stackId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/primaryskill/by-stack?stack_id=${stackId}`)
      const primarySkillsData = response.data.map((skill) => ({
        id: skill.skill_id,
        name: skill.skill_name,
        techStackId: stackId,
      }))
      setPrimarySkills(primarySkillsData)
    } catch (error) {
      console.error("Error fetching primary skills:", error)
    }
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
    setPage(1)
    setSearchTerm("")
    setSkillSearchTerm("")
  }

  const handleAddProject = async () => {
    if (!newProjectName.trim()) return

    try {
      if (isEditMode && editItem) {
        // Update existing project
        await axios.put(`http://localhost:8000/api/projects/${editItem.id}`, {
          name: newProjectName,
        })
        setProjects(
          projects.map((p) =>
            p.id === editItem.id ? { ...p, name: newProjectName, category: newProjectCategory } : p,
          ),
        )
        setAlert({ open: true, message: "Project updated successfully", severity: "success" })
      } else {
        // Add new project
        const response = await axios.post("http://localhost:8000/api/add-project", {
          ProjectName: newProjectName,
        })
        setProjects([...projects, response.data])
        setAlert({ open: true, message: "Project added successfully", severity: "success" })
      }
    } catch (error) {
      console.error("Error saving project:", error)
      setAlert({ open: true, message: "Error saving project", severity: "error" })
    }

    setNewProjectName("")
    setIsAddProjectDialogOpen(false)
    setIsEditMode(false)
    setEditItem(null)
  }

  const handleAddDivision = async () => {
    if (!newDivisionName.trim()) return

    try {
      if (isEditMode && editItem) {
        // Update existing division
        await axios.put(`http://localhost:8000/api/service-divisions/${editItem.id}`, {
          service_name: newDivisionName,
        })
        setServiceDivisions(
          serviceDivisions.map((d) => (d.id === editItem.id ? { ...d, service_name: newDivisionName } : d)),
        )
        setAlert({ open: true, message: "Service division updated successfully", severity: "success" })
      } else {
        // Add new division
        const response = await axios.post("http://localhost:8000/api/add-service-division", {
          service_name: newDivisionName,
        })
        setServiceDivisions([...serviceDivisions, response.data])
        setAlert({ open: true, message: "Service division added successfully", severity: "success" })
      }
    } catch (error) {
      console.error("Error saving service division:", error)
      setAlert({ open: true, message: "Error saving service division", severity: "error" })
    }

    setNewDivisionName("")
    setIsAddDivisionDialogOpen(false)
    setIsEditMode(false)
    setEditItem(null)
  }

  const handleAddTechStack = async () => {
    if (!newTechStackName.trim()) return

    try {
      if (isEditMode && editItem) {
        // Update existing tech stack
        await axios.put(`http://localhost:8000/api/tech-stacks/${editItem.id}`, {
          name: newTechStackName,
        })
        setTechStacks(techStacks.map((t) => (t.id === editItem.id ? { ...t, name: newTechStackName } : t)))
        setAlert({ open: true, message: "Tech stack updated successfully", severity: "success" })
      } else {
        // Add new tech stack
        const response = await axios.post("http://localhost:8000/api/tech-stacks", {
          stackName: newTechStackName,
        })
        setTechStacks([...techStacks, response.data])
        setAlert({ open: true, message: "Tech stack added successfully", severity: "success" })
      }
    } catch (error) {
      console.error("Error saving tech stack:", error.response ? error.response.data : error.message)
      setAlert({ open: true, message: "Error saving tech stack", severity: "error" })
    }

    setNewTechStackName("")
    setIsAddTechStackDialogOpen(false)
    setIsEditMode(false)
    setEditItem(null)
  }

  const handleAddPrimarySkill = async () => {
    if (!newPrimarySkillName.trim() || !selectedTechStackId) return

    try {
      if (isEditMode && editItem) {
        // Update existing primary skill
        await axios.put(`http://localhost:8000/api/primary-skills/${editItem.id}`, {
          name: newPrimarySkillName,
          techStackId: selectedTechStackId,
        })
        setPrimarySkills(
          primarySkills.map((s) =>
            s.id === editItem.id ? { ...s, name: newPrimarySkillName, techStackId: selectedTechStackId } : s,
          ),
        )
        setAlert({ open: true, message: "Primary skill updated successfully", severity: "success" })
      } else {
        // Add new primary skill
        const response = await axios.post("http://localhost:8000/api/primary-skill", {
          skillName: newPrimarySkillName,
          stackId: selectedTechStackId,
        })
        setPrimarySkills([...primarySkills, response.data])
        setAlert({ open: true, message: "Primary skill added successfully", severity: "success" })
      }
    } catch (error) {
      console.error("Error saving primary skill:", error)
      setAlert({ open: true, message: "Error saving primary skill", severity: "error" })
    }

    setNewPrimarySkillName("")
    setSelectedTechStackId("")
    setIsAddPrimarySkillDialogOpen(false)
    setIsEditMode(false)
    setEditItem(null)
  }

  const handleDeleteProject = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/projects/${id}`)
      setProjects(projects.filter((p) => p.id !== id))
      setAlert({ open: true, message: "Project deleted successfully", severity: "success" })
    } catch (error) {
      console.error("Error deleting project:", error)
      setAlert({ open: true, message: "Error deleting project", severity: "error" })
    }
  }

  const handleDeleteDivision = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/delete-service-division/${id}`)
      setServiceDivisions(serviceDivisions.filter((d) => d.id !== id))
      setAlert({ open: true, message: "Service division deleted successfully", severity: "success" })
    } catch (error) {
      console.error("Error deleting service division:", error)
      setAlert({ open: true, message: "Error deleting service division", severity: "error" })
    }
  }

  const handleDeleteTechStack = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/delete-tech-stack/${id}`)
      setTechStacks(techStacks.filter((t) => t.id !== id))
      // Also remove associated primary skills
      setPrimarySkills(primarySkills.filter((s) => s.techStackId !== id))
      setAlert({ open: true, message: "Tech stack deleted successfully", severity: "success" })
    } catch (error) {
      console.error("Error deleting tech stack:", error)
      // For demo, just update the state directly
      setTechStacks(techStacks.filter((t) => t.id !== id))
      setPrimarySkills(primarySkills.filter((s) => s.techStackId !== id))
      setAlert({ open: true, message: "Error deleting tech stack", severity: "error" })
    }
  }

  const handleDeletePrimarySkill = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/primary-skills/${id}`)
      setPrimarySkills(primarySkills.filter((s) => s.id !== id))
      setAlert({ open: true, message: "Primary skill deleted successfully", severity: "success" })
    } catch (error) {
      console.error("Error deleting primary skill:", error)
      // For demo, just update the state directly
      setPrimarySkills(primarySkills.filter((s) => s.id !== id))
      setAlert({ open: true, message: "Error deleting primary skill", severity: "error" })
    }
  }

  const handleEditProject = (project) => {
    setEditItem(project)
    setNewProjectName(project.name)
    setNewProjectCategory(project.category || "")
    setIsEditMode(true)
    setIsAddProjectDialogOpen(true)
  }

  const handleEditDivision = (division) => {
    setEditItem(division)
    setNewDivisionName(division.name)
    setIsEditMode(true)
    setIsAddDivisionDialogOpen(true)
  }

  const handleEditTechStack = (techStack) => {
    setEditItem(techStack)
    setNewTechStackName(techStack.name)
    setIsEditMode(true)
    setIsAddTechStackDialogOpen(true)
  }

  const handleEditPrimarySkill = (skill) => {
    setEditItem(skill)
    setNewPrimarySkillName(skill.name)
    setSelectedTechStackId(skill.techStackId)
    setIsEditMode(true)
    setIsAddPrimarySkillDialogOpen(true)
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
    setPage(1)
  }

  const handleSkillSearchChange = (event) => {
    setSkillSearchTerm(event.target.value)
  }

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode)
    }
  }

  const handleSortOrderChange = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  const handlePageChange = (event, value) => {
    setPage(value)
  }

  const handleAccordionChange = (techStackId) => async (event, isExpanded) => {
    setExpandedTechStack(isExpanded ? techStackId : null)
    if (isExpanded) {
      await fetchPrimarySkills(techStackId)
    }
  }

  const handleTechStackChange = (event) => {
    const stackId = event.target.value
    setSelectedTechStackId(stackId)
    fetchPrimarySkills(stackId)
  }

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false })
  }

  // Filter and sort projects
  const filteredProjects = projects
    .filter(
      (project) =>
        project.name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (projectCategory === "all" || project.category === projectCategory),
    )
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.name.localeCompare(b.name)
      } else {
        return b.name.localeCompare(a.name)
      }
    })

  // Paginate projects
  const paginatedProjects = filteredProjects.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  // Filter primary skills by search term
  const filteredPrimarySkills = primarySkills.filter((skill) =>
    skill.name ? skill.name.toLowerCase().includes(skillSearchTerm.toLowerCase()) : false
  )

  // Group primary skills by tech stack
  const groupedSkills = techStacks.map((techStack) => ({
    ...techStack,
    skills: filteredPrimarySkills.filter((skill) => skill.techStackId === techStack.id),
  }))

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
              width:"40px !important",
              marginLeft:"25px"
            },
            "& .Mui-selected": {
              color: "#09459E !important",
              fontWeight: "500",
            },
          }}
        >
          <Tab
            label="Projects"
            sx={{
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: "400",
              minWidth: "120px",
            }}
          />
          <Tab
            label="Service Divisions"
            sx={{
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: "400",
              minWidth: "120px",
            }}
          />
          <Tab
            label="Primary Skills"
            sx={{
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: "400",
              minWidth: "120px",
            }}
          />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {tabValue === 0 && (
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 500, color: "#333" }}>
                  Project List
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    setIsEditMode(false)
                    setNewProjectName("")
                    setNewProjectCategory("")
                    setIsAddProjectDialogOpen(true)
                  }}
                  sx={{
                    backgroundColor: "#09459E",
                    textTransform: "none",
                    boxShadow: "none",
                    borderRadius: "25px",
                    padding: "6px 20px",
                    "&:hover": {
                      backgroundColor: "#083a80",
                      boxShadow: "0 4px 8px rgba(9, 69, 158, 0.2)",
                    },
                  }}
                >
                  Add Project
                </Button>
              </Box>

              <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
                <TextField
                  placeholder="Search projects..."
                  variant="outlined"
                  size="medium"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  sx={{
                    flexGrow: 1,
                    minWidth: "200px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      fontSize: "12px",
                      height: "36px",
                      
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
                 
                

                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={handleViewModeChange}
                  size="small"
                  sx={{
                    "& .MuiToggleButton-root": {
                      borderRadius: "8px",
                      border: "1px solid #e0e0e0",
                      "&.Mui-selected": {
                        backgroundColor: "#f0f7ff",
                        color: "#09459E",
                      },
                    },
                    "& .MuiToggleButtonGroup-grouped:not(:first-of-type)": {
                      borderRadius: "8px",
                      marginLeft: "4px",
                      borderLeft: "1px solid #e0e0e0",
                      
                    },
                    "& .MuiToggleButtonGroup-grouped:first-of-type": {
                      borderRadius: "8px",
                    },
                  }}
                >
                  <Tooltip title="Sort order">
                  <IconButton
                    onClick={handleSortOrderChange}
                    size="small"
                    sx={{
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      padding: "8px",
                    }}
                  >
                    <SortIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                  <ToggleButton value="list" aria-label="list view" style={{marginRight:"4px" , marginLeft:"8px"}} >
                    <ViewListIcon fontSize="small" />
                  </ToggleButton>
                  <ToggleButton value="grid" aria-label="grid view">
                    <GridViewIcon fontSize="small" />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                  <CircularProgress size={40} sx={{ color: "#09459E" }} />
                </Box>
              ) : (
                <>
                  {viewMode === "list" ? (
                    <Paper
                      elevation={0}
                      sx={{
                        maxHeight: 400,
                        overflow: "auto",
                        mb: 3,
                        border: "1px solid #f0f0f0",
                        borderRadius: "10px",
                      }}
                    >
                      <List>
                        {paginatedProjects.map((project) => (
                          <ListItem
                            key={project.id}
                            secondaryAction={
                              <Box>
                                <IconButton
                                  edge="end"
                                  aria-label="edit"
                                  onClick={() => handleEditProject(project)}
                                  sx={{
                                    color: "#09459E",
                                    "&:hover": { backgroundColor: "rgba(9, 69, 158, 0.08)" },
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  edge="end"
                                  aria-label="delete"
                                  onClick={() => handleDeleteProject(project.id)}
                                  sx={{
                                    color: "#d32f2f",
                                    "&:hover": { backgroundColor: "rgba(211, 47, 47, 0.08)" },
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            }
                            sx={{
                              borderBottom: "1px solid #f0f0f0",
                              "&:hover": { backgroundColor: "#f9f9f9" },
                              transition: "background-color 0.2s",
                            }}
                          >
                            <ListItemText
                              primary={<Typography sx={{ fontWeight: 500 }}>{project.name}</Typography>}
                              secondary={
                                <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                                  {project.category && (
                                    <Chip
                                      label={project.category}
                                      size="small"
                                      sx={{
                                        mr: 1,
                                        backgroundColor: "#e3f2fd",
                                        color: "#0d47a1",
                                        fontSize: "0.7rem",
                                      }}
                                    />
                                  )}
                                  <Typography variant="caption" color="text.secondary">
                                    ID: {project.id}
                                  </Typography>
                                </Box>
                              }
                            />
                          </ListItem>
                        ))}
                        {paginatedProjects.length === 0 && (
                          <ListItem>
                            <ListItemText
                              primary="No projects found"
                              sx={{ color: "text.secondary", fontStyle: "italic", textAlign: "center" }}
                            />
                          </ListItem>
                        )}
                      </List>
                    </Paper>
                  ) : (
                    <Box sx={{ mb: 3 }}>
                      <Grid container spacing={5}>
                        {paginatedProjects.map((project) => (
                          <Grid item xs={12} sm={6} md={4} key={project.id}>
                            <Card
                            className="card-content"
                              sx={{
                                height: "100%",
                                gap: "12px" ,
                                
                                display: "flex",
                                flexDirection: "column",
                                transition: "transform 0.2s, box-shadow 0.2s",
                                borderRadius: "10px",
                                overflow: "hidden",
                                border: "1px solid #f0f0f0",
                                "&:hover": {
                                  transform: "translateY(-4px)",
                                  boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                                },
                              }}
                            >
                              <CardContent  sx={{ flexGrow: 1, p: 2 ,mb:10 }}>
                                <Typography
                                  variant="h6"
                                  component="div"
                                  sx={{ mb: 1, fontSize: "1rem", fontWeight: 500 }}
                                >
                                  {project.name}
                                </Typography>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                  {project.category && (
                                    <Chip
                                      label={project.category}
                                      size="small"
                                      sx={{
                                        mr: 1,
                                        backgroundColor: "#e3f2fd",
                                        color: "#0d47a1",
                                        fontSize: "0.7rem",
                                      }}
                                    />
                                  )}
                                  <Typography variant="caption" color="text.secondary">
                                    ID: {project.id}
                                  </Typography>
                                </Box>
                              </CardContent>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                  p: 1,
                                  borderTop: "1px solid #f0f0f0",
                                  backgroundColor: "#f9f9f9",
                                }}
                              >
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditProject(project)}
                                  sx={{
                                    color: "#09459E",
                                    "&:hover": { backgroundColor: "rgba(9, 69, 158, 0.08)" },
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteProject(project.id)}
                                  sx={{
                                    color: "#d32f2f",
                                    "&:hover": { backgroundColor: "rgba(211, 47, 47, 0.08)" },
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </Card>
                          </Grid>
                        ))}
                        {paginatedProjects.length === 0 && (
                          <Grid item xs={12}>
                            <Paper sx={{ p: 3, textAlign: "center", borderRadius: "10px" }}>
                              <Typography color="text.secondary" sx={{ fontStyle: "italic" }}>
                                No projects found
                              </Typography>
                            </Paper>
                          </Grid>
                        )}
                      </Grid>
                    </Box>
                  )}

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop:"5rem" }}>
                    <Typography variant="body2" color="text.secondary">
                      Showing {paginatedProjects.length} of {filteredProjects.length} projects
                    </Typography>
                    <Pagination
                      count={Math.ceil(filteredProjects.length / itemsPerPage)}
                      page={page}
                      onChange={handlePageChange}
                      color="primary"
                      size="small"
                      sx={{
                        "& .MuiPaginationItem-root": {
                          color: "#09459E",
                        },
                        "& .Mui-selected": {
                          backgroundColor: "rgba(9, 69, 158, 0.1) !important",
                        },
                      }}
                    />
                  </Box>
                </>
              )}
            </Box>
          )}

          {tabValue === 1 && (
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 500, color: "#333" }}>
                  Service Division List
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    setIsEditMode(false)
                    setNewDivisionName("")
                    setIsAddDivisionDialogOpen(true)
                  }}
                  sx={{
                    backgroundColor: "#09459E",
                    textTransform: "none",
                    boxShadow: "none",
                    borderRadius: "25px",
                    padding: "6px 20px",
                    "&:hover": {
                      backgroundColor: "#083a80",
                      boxShadow: "0 4px 8px rgba(9, 69, 158, 0.2)",
                    },
                  }}
                >
                  Add Service Division
                </Button>
              </Box>

              <TextField
                placeholder="Search service divisions..."
                variant="outlined"
                size="small"
                fullWidth
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    fontSize: "11px",
                    height: "36px",
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />

              <Paper
                elevation={0}
                sx={{
                  maxHeight: 400,
                  overflow: "auto",
                  mb: 3,
                  border: "1px solid #f0f0f0",
                  borderRadius: "10px",
                }}
              >
                <List>
                  {serviceDivisions.map((division) => (
                    <ListItem
                      key={division.id}
                      secondaryAction={
                        <Box>
                          <IconButton
                            edge="end"
                            aria-label="edit"
                            onClick={() => handleEditDivision(division)}
                            sx={{
                              color: "#09459E",
                              "&:hover": { backgroundColor: "rgba(9, 69, 158, 0.08)" },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => handleDeleteDivision(division.id)}
                            sx={{
                              color: "#d32f2f",
                              "&:hover": { backgroundColor: "rgba(211, 47, 47, 0.08)" },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      }
                      sx={{
                        borderBottom: "1px solid #f0f0f0",
                        "&:hover": { backgroundColor: "#f9f9f9" },
                        transition: "background-color 0.2s",
                      }}
                    >
                      <ListItemText primary={<Typography sx={{ fontWeight: 500 }}>{division.name}</Typography>} />
                    </ListItem>
                  ))}
                  {serviceDivisions.length === 0 && (
                    <ListItem>
                      <ListItemText
                        primary="No service divisions found"
                        sx={{ color: "text.secondary", fontStyle: "italic", textAlign: "center" }}
                      />
                    </ListItem>
                  )}
                </List>
              </Paper>
            </Box>
          )}

          {tabValue === 2 && (
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 500, color: "#333" }}>
                  Primary Skills
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<CodeIcon />}
                    onClick={() => {
                      setIsEditMode(false)
                      setNewTechStackName("")
                      setIsAddTechStackDialogOpen(true)
                    }}
                    sx={{
                      borderColor: "#09459E",
                      color: "#09459E",
                      textTransform: "none",
                      borderRadius: "25px",
                      padding: "6px 20px",
                      "&:hover": {
                        borderColor: "#083a80",
                        backgroundColor: "rgba(9, 69, 158, 0.04)",
                       
                      },
                    }}
                  >
                    Add Tech Stack
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setIsEditMode(false)
                      setNewPrimarySkillName("")
                      setSelectedTechStackId("")
                      setIsAddPrimarySkillDialogOpen(true)
                    }}
                    sx={{
                      backgroundColor: "#09459E",
                      textTransform: "none",
                      boxShadow: "none",
                      borderRadius: "25px",
                    padding: "6px 20px",
                      "&:hover": {
                        backgroundColor: "#083a80",
                        boxShadow: "0 4px 8px rgba(9, 69, 158, 0.2)",
                      },
                    }}
                  >
                    Add Primary Skill
                  </Button>
                </Box>
              </Box>

              <TextField
                placeholder="Search primary skills..."
                variant="outlined"
                size="small"
                fullWidth
                value={skillSearchTerm}
                onChange={handleSkillSearchChange}
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    fontSize: "11px",
                    height: "36px",
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />

              <Paper
                elevation={0}
                sx={{
                  maxHeight: 400,
                  overflow: "auto",
                  mb: 3,
                  border: "1px solid #f0f0f0",
                  borderRadius: "10px",
                }}
              >
                {groupedSkills.map((techStack) => (
                  <Accordion
                    key={techStack.id}
                    expanded={expandedTechStack === techStack.id}
                    onChange={handleAccordionChange(techStack.id)}
                    sx={{
                      "&:before": { display: "none" },
                      boxShadow: "none",
                      borderBottom: "1px solid #e0e0e0",
                      "&:last-child": {
                        borderBottom: "none",
                      },
                      "&.Mui-expanded": {
                        margin: 0,
                      },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={{
                        backgroundColor: "#f5f5f5",
                        "&:hover": { backgroundColor: "#f0f0f0" },
                        minHeight: "48px !important",
                        "& .MuiAccordionSummary-content": {
                          margin: "12px 0 !important",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "100%",
                          pr: 2,
                        }}
                      >
                        <Typography sx={{ fontWeight: 500 }}>{techStack.name}</Typography>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Badge badgeContent={techStack.skills.length} color="primary" sx={{ mr: 2 }} />
                          <Box>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditTechStack(techStack)
                              }}
                              sx={{
                                mr: 1,
                                color: "#09459E",
                                "&:hover": { backgroundColor: "rgba(9, 69, 158, 0.08)" },
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteTechStack(techStack.id)
                              }}
                              sx={{
                                color: "#d32f2f",
                                "&:hover": { backgroundColor: "rgba(211, 47, 47, 0.08)" },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 0 }}>
                      <List dense>
                        {techStack.skills.length > 0 ? (
                          techStack.skills.map((skill) => (
                            <ListItem
                              key={skill.id}
                              secondaryAction={
                                <Box>
                                  <IconButton
                                    edge="end"
                                    aria-label="edit"
                                    onClick={() => handleEditPrimarySkill(skill)}
                                    sx={{
                                      color: "#09459E",
                                      "&:hover": { backgroundColor: "rgba(9, 69, 158, 0.08)" },
                                    }}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                  <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={() => handleDeletePrimarySkill(skill.id)}
                                    sx={{
                                      color: "#d32f2f",
                                      "&:hover": { backgroundColor: "rgba(211, 47, 47, 0.08)" },
                                    }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              }
                              sx={{
                                borderBottom: "1px solid #f0f0f0",
                                "&:hover": { backgroundColor: "#f9f9f9" },
                                "&:last-child": {
                                  borderBottom: "none",
                                },
                              }}
                            >
                              <ListItemText primary={skill.name} />
                            </ListItem>
                          ))
                        ) : (
                          <ListItem>
                            <ListItemText
                              primary="No skills found for this tech stack"
                              sx={{ color: "text.secondary", fontStyle: "italic", textAlign: "center" }}
                            />
                          </ListItem>
                        )}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                ))}
                {groupedSkills.length === 0 && (
                  <Box sx={{ p: 3, textAlign: "center" }}>
                    <Typography color="text.secondary" sx={{ fontStyle: "italic" }}>
                      No tech stacks found
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Add Project Dialog */}
      <Dialog
        open={isAddProjectDialogOpen}
        onClose={() => setIsAddProjectDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: "10px",
            maxWidth: "500px",
            width: "100%",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 500, borderBottom: "1px solid #f0f0f0", pb: 2 }}>
          {isEditMode ? "Edit Project" : "Add New Project"}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Project Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={() => setIsAddProjectDialogOpen(false)}
            sx={{
              color: "#09459E",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "rgba(9, 69, 158, 0.04)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddProject}
            variant="contained"
            sx={{
              backgroundColor: "#09459E",
              textTransform: "none",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#083a80",
              },
            }}
          >
            {isEditMode ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Service Division Dialog */}
      <Dialog
        open={isAddDivisionDialogOpen}
        onClose={() => setIsAddDivisionDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: "10px",
            maxWidth: "500px",
            width: "100%",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 500, borderBottom: "1px solid #f0f0f0", pb: 2 }}>
          {isEditMode ? "Edit Service Division" : "Add New Service Division"}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Service Division Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newDivisionName}
            onChange={(e) => setNewDivisionName(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={() => setIsAddDivisionDialogOpen(false)}
            sx={{
              color: "#09459E",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "rgba(9, 69, 158, 0.04)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddDivision}
            variant="contained"
            sx={{
              backgroundColor: "#09459E",
              textTransform: "none",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#083a80",
              },
            }}
          >
            {isEditMode ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Tech Stack Dialog */}
      <Dialog
        open={isAddTechStackDialogOpen}
        onClose={() => setIsAddTechStackDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: "10px",
            maxWidth: "500px",
            width: "100%",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 500, borderBottom: "1px solid #f0f0f0", pb: 2 }}>
          {isEditMode ? "Edit Tech Stack" : "Add New Tech Stack"}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Tech Stack Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newTechStackName}
            onChange={(e) => setNewTechStackName(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={() => setIsAddTechStackDialogOpen(false)}
            sx={{
              color: "#09459E",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "rgba(9, 69, 158, 0.04)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddTechStack}
            variant="contained"
            sx={{
              backgroundColor: "#09459E",
              textTransform: "none",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#083a80",
              },
            }}
          >
            {isEditMode ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Primary Skill Dialog */}
      <Dialog
        open={isAddPrimarySkillDialogOpen}
        onClose={() => setIsAddPrimarySkillDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: "10px",
            maxWidth: "500px",
            width: "100%",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 500, borderBottom: "1px solid #f0f0f0", pb: 2 }}>
          {isEditMode ? "Edit Primary Skill" : "Add New Primary Skill"}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Primary Skill Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newPrimarySkillName}
            onChange={(e) => setNewPrimarySkillName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="tech-stack-label">Tech Stack</InputLabel>
              <Select
                labelId="tech-stack-label"
                value={selectedTechStackId}
                onChange={handleTechStackChange}
                label="Tech Stack"
              >
                {techStacks.map((techStack) => (
                  <MenuItem key={techStack.id} value={techStack.id}>
                    {techStack.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Tooltip title="Add New Tech Stack">
              <Fab
                size="small"
                color="primary"
                onClick={() => {
                  setIsAddPrimarySkillDialogOpen(false)
                  setIsAddTechStackDialogOpen(true)
                }}
                sx={{
                  backgroundColor: "#09459E",
                  "&:hover": { backgroundColor: "#083a80" },
                }}
              >
                <AddIcon />
              </Fab>
            </Tooltip>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={() => setIsAddPrimarySkillDialogOpen(false)}
            sx={{
              color: "#09459E",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "rgba(9, 69, 158, 0.04)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddPrimarySkill}
            variant="contained"
            sx={{
              backgroundColor: "#09459E",
              textTransform: "none",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#083a80",
              },
            }}
            disabled={!selectedTechStackId || !newPrimarySkillName.trim()}
          >
            {isEditMode ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseAlert} severity={alert.severity} variant="filled" sx={{ width: "100%" }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default RequestFormEditor

