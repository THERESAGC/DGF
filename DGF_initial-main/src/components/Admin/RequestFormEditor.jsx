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
  Badge,
  Fab,
  Tooltip,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Snackbar,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
  Card,
  CardContent,
  Pagination,
  MenuItem,
  Select,
  FormControl,
  FormLabel,
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import SearchIcon from "@mui/icons-material/Search"
import ViewListIcon from "@mui/icons-material/ViewList"
import GridViewIcon from "@mui/icons-material/GridView"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import CodeIcon from "@mui/icons-material/Code"
import BusinessIcon from "@mui/icons-material/Business"
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward"
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward"
import MenuBookIcon from "@mui/icons-material/MenuBook"
import axios from "axios"

const RequestFormEditor = () => {
  const [tabValue, setTabValue] = useState(0)
  const [projects, setProjects] = useState([])
  const [serviceDivisions, setServiceDivisions] = useState([])
  const [techStacks, setTechStacks] = useState([])
  const [primarySkills, setPrimarySkills] = useState([])
  const [sources, setSources] = useState([])
  const [learningObjectives, setLearningObjectives] = useState([])

  const [isAddProjectDialogOpen, setIsAddProjectDialogOpen] = useState(false)
  const [isAddDivisionDialogOpen, setIsAddDivisionDialogOpen] = useState(false)
  const [isAddTechStackDialogOpen, setIsAddTechStackDialogOpen] = useState(false)
  const [isAddPrimarySkillDialogOpen, setIsAddPrimarySkillDialogOpen] = useState(false)
  const [isAddNewDivisionDialogOpen, setIsAddNewDivisionDialogOpen] = useState(false)
  const [isAddSourceDialogOpen, setIsAddSourceDialogOpen] = useState(false)
  const [isAddLearningObjectiveDialogOpen, setIsAddLearningObjectiveDialogOpen] = useState(false)
  const [isAddNewSourceDialogOpen, setIsAddNewSourceDialogOpen] = useState(false)

  const [newProjectName, setNewProjectName] = useState("")
  const [newDivisionName, setNewDivisionName] = useState("")
  const [newTechStackName, setNewTechStackName] = useState("")
  const [newPrimarySkillName, setNewPrimarySkillName] = useState("")
  const [newSourceName, setNewSourceName] = useState("")
  const [newLearningObjectiveName, setNewLearningObjectiveName] = useState("")
  const [selectedTechStackId, setSelectedTechStackId] = useState("")
  const [selectedServiceDivisionId, setSelectedServiceDivisionId] = useState("")
  const [selectedSourceId, setSelectedSourceId] = useState("")

  const [editItem, setEditItem] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)

  const [searchTerm, setSearchTerm] = useState("")
  const [skillSearchTerm, setSkillSearchTerm] = useState("")
  const [objectiveSearchTerm, setObjectiveSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState("list")
  const [sortOrder, setSortOrder] = useState("asc")
  const [expandedServiceDivision, setExpandedServiceDivision] = useState(null)
  const [expandedTechStack, setExpandedTechStack] = useState(null)
  const [expandedSource, setExpandedSource] = useState(null)
  const [page, setPage] = useState({})
  const [loading, setLoading] = useState(false)

  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" })

  const itemsPerPage = 5

  useEffect(() => {
    fetchServiceDivisions()
    fetchTechStacks()
    fetchSources()
  }, [])

  const fetchServiceDivisions = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/services")
      const serviceDivisionsData = response.data.services.map((service) => ({
        id: service.id,
        name: service.service_name,
      }))
      setServiceDivisions(serviceDivisionsData)

      // Initialize pagination state for each service division
      const paginationState = {}
      serviceDivisionsData.forEach((division) => {
        paginationState[division.id] = 1
      })
      setPage(paginationState)
    } catch (error) {
      console.error("Error fetching service divisions:", error)
    }
  }

  const fetchProjects = async (serviceDivisionId) => {
    try {
        const response = await axios.get(
            `http://localhost:8000/api/project/by-service-division?service_division_id=${serviceDivisionId}`
        );

        // Utility function to decode HTML entities
        const decodeHtmlEntities = (text) => {
            if (!text) return ""; // Handle null or undefined input
            const parser = new DOMParser();
            let decodedString = text;

            // Recursively decode until no more entities are left
            while (decodedString !== parser.parseFromString(decodedString, "text/html").documentElement.textContent) {
                decodedString = parser.parseFromString(decodedString, "text/html").documentElement.textContent;
            }

            return decodedString;
        };

        const projectsData = response.data.map((project) => ({
            id: project.ProjectID,
            name: decodeHtmlEntities(project.ProjectName), // Decode HTML entities
            serviceDivisionId: serviceDivisionId,
        }));

        setProjects(projectsData);
    } catch (error) {
        console.error("Error fetching projects:", error);
    }
};

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

  // Mock functions for sources and learning objectives
  const fetchSources = async () => {
    try {
        // Make an API call to fetch sources
        const response = await axios.get("http://localhost:8000/api/sources");
        
        // Map the response data to match the expected structure
        const sourcesData = response.data.map((source) => ({
            id: source.source_id,
            name: source.source_name,
        }));
        
        setSources(sourcesData);

        // Initialize pagination state for each source
        const paginationState = {};
        sourcesData.forEach((source) => {
            paginationState[source.id] = 1;
        });
        setPage((prevState) => ({ ...prevState, ...paginationState }));
    } catch (error) {
        console.error("Error fetching sources:", error);
    }
};
  const fetchLearningObjectives = async (sourceId) => {
      try {
        const response = await axios.get(`http://localhost:8000/api/training/objectives?source_id=${sourceId}`);
        const objectives = response.data.map((objective) => ({
          id: objective.training_id,
          name: objective.training_name,
          sourceId: sourceId,
        }));
        setLearningObjectives(objectives);
      } catch (error) {
        console.error("Error fetching objectives for source:", error);
      }
    };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
    setSearchTerm("")
    setSkillSearchTerm("")
    setObjectiveSearchTerm("")
  }

  const handleAddProject = async () => {
    if (!newProjectName.trim() || !selectedServiceDivisionId) return

    try {
      if (isEditMode && editItem) {
        // Update existing project
        await axios.put(`http://localhost:8000/api/projects/${editItem.id}`, {
          name: newProjectName,
          serviceDivisionId: selectedServiceDivisionId,
        })
        setProjects(
          projects.map((p) =>
            p.id === editItem.id ? { ...p, name: newProjectName, serviceDivisionId: selectedServiceDivisionId } : p,
          ),
        )
        setAlert({ open: true, message: "Project updated successfully", severity: "success" })
      } else {
        // Add new project
        const response = await axios.post("http://localhost:8000/api/add-project", {
          ProjectName: newProjectName,
          serviceDivisionId: selectedServiceDivisionId,
        })

        // Add the new project to the state with the service division ID
        const newProject = {
          id: response.data.ProjectID || Date.now(), // Fallback to timestamp if API doesn't return ID
          name: newProjectName,
          serviceDivisionId: selectedServiceDivisionId,
        }

        setProjects([...projects, newProject])
        setAlert({ open: true, message: "Project added successfully", severity: "success" })
      }
    } catch (error) {
      console.error("Error saving project:", error)
      setAlert({ open: true, message: "Error saving project", severity: "error" })
    }

    setNewProjectName("")
    setSelectedServiceDivisionId("")
    setIsAddProjectDialogOpen(false)
    setIsEditMode(false)
    setEditItem(null)
  }

  const handleAddDivision = async () => {
    if (!newDivisionName.trim()) return

    try {
      // Add new division
      const response = await axios.post("http://localhost:8000/api/add-service-division", {
        service_name: newDivisionName,
      })

      const newDivision = {
        id: response.data.id || Date.now(),
        name: newDivisionName,
      }

      const updatedDivisions = [...serviceDivisions, newDivision]
      setServiceDivisions(updatedDivisions)

      // Initialize pagination for the new division
      setPage((prevState) => ({
        ...prevState,
        [newDivision.id]: 1,
      }))

      setAlert({ open: true, message: "Service division added successfully", severity: "success" })

      // If adding from the Add Project dialog, select the new division
      if (isAddNewDivisionDialogOpen) {
        setSelectedServiceDivisionId(newDivision.id)
      }
    } catch (error) {
      console.error("Error saving service division:", error)
      setAlert({ open: true, message: "Error saving service division", severity: "error" })
    }

    setNewDivisionName("")
    setIsAddDivisionDialogOpen(false)
    setIsAddNewDivisionDialogOpen(false)
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

  // Functions for handling sources and learning objectives
  const handleAddSource = async () => {
    if (!newSourceName.trim()) return;

    try {
        if (isEditMode && editItem) {
            // Update existing source (if needed, implement the update API call here)
            setSources(sources.map((s) => (s.id === editItem.id ? { ...s, name: newSourceName } : s)));
            setAlert({ open: true, message: "Source updated successfully", severity: "success" });
        } else {
            // Add new source using the API
            const response = await axios.post("http://localhost:8000/api/add-source", {
                source_name: newSourceName,
            });

            const newSource = {
                id: response.data.insertId, // Use the ID returned by the API
                name: newSourceName,
            };

            setSources([...sources, newSource]);

            // Initialize pagination for the new source
            setPage((prevState) => ({
                ...prevState,
                [newSource.id]: 1,
            }));

            setAlert({ open: true, message: "Source added successfully", severity: "success" });

            // If adding from the Add Learning Objective dialog, select the new source
            if (isAddNewSourceDialogOpen) {
                setSelectedSourceId(newSource.id);
            }
        }
    } catch (error) {
        console.error("Error saving source:", error);
        setAlert({ open: true, message: "Error saving source", severity: "error" });
    }

    setNewSourceName("");
    setIsAddSourceDialogOpen(false);
    setIsAddNewSourceDialogOpen(false);
    setIsEditMode(false);
    setEditItem(null);
};

const handleAddLearningObjective = async () => {
  if (!newLearningObjectiveName.trim() || !selectedSourceId) return;

  try {
      if (isEditMode && editItem) {
          // Update existing learning objective
          setLearningObjectives(
              learningObjectives.map((o) =>
                  o.id === editItem.id
                      ? { ...o, name: newLearningObjectiveName, sourceId: selectedSourceId }
                      : o
              )
          );
          setAlert({ open: true, message: "Learning objective updated successfully", severity: "success" });
      } else {
          // Add new learning objective using the API
          const response = await axios.post("http://localhost:8000/api/add-learning-objective", {
              training_name: newLearningObjectiveName,
              source_id: selectedSourceId,
          });

          const newObjective = {
              id: response.data.data.training_id, // Use the ID returned by the API
              name: newLearningObjectiveName,
              sourceId: selectedSourceId,
          };

          setLearningObjectives([...learningObjectives, newObjective]);
          setAlert({ open: true, message: "Learning objective added successfully", severity: "success" });
      }
  } catch (error) {
      console.error("Error saving learning objective:", error);
      setAlert({ open: true, message: "Error saving learning objective", severity: "error" });
  }

  setNewLearningObjectiveName("");
  setSelectedSourceId("");
  setIsAddLearningObjectiveDialogOpen(false);
  setIsEditMode(false);
  setEditItem(null);
};

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

      // Also remove associated projects or reassign them
      setProjects(projects.filter((p) => p.serviceDivisionId !== id))

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
      await axios.delete(`http://localhost:8000/api/primary-skill/${id}`)
      setPrimarySkills(primarySkills.filter((s) => s.id !== id))
      setAlert({ open: true, message: "Primary skill deleted successfully", severity: "success" })
    } catch (error) {
      console.error("Error deleting primary skill:", error)
      // For demo, just update the state directly
      setPrimarySkills(primarySkills.filter((s) => s.id !== id))
      setAlert({ open: true, message: "Error deleting primary skill", severity: "error" })
    }
  }

  // Functions for deleting sources and learning objectives
  const handleDeleteSource = async (id) => {
    try {
        // Call the delete source API
        await axios.delete(`http://localhost:8000/api/delete-source/${id}`);

        // Update the state to remove the deleted source
        setSources(sources.filter((s) => s.id !== id));

        // Also remove associated learning objectives
        setLearningObjectives(learningObjectives.filter((o) => o.sourceId !== id));

        // Show success alert
        setAlert({ open: true, message: "Source deleted successfully", severity: "success" });
    } catch (error) {
        console.error("Error deleting source:", error);

        // Show error alert
        setAlert({ open: true, message: "Error deleting source", severity: "error" });
    }
};

const handleDeleteLearningObjective = async (id) => {
  try {
      // Call the delete learning objective API
      await axios.delete(`http://localhost:8000/api/delete-learning-objective/${id}`);

      // Update the state to remove the deleted learning objective
      setLearningObjectives(learningObjectives.filter((o) => o.id !== id));

      // Show success alert
      setAlert({ open: true, message: "Learning objective deleted successfully", severity: "success" });
  } catch (error) {
      console.error("Error deleting learning objective:", error);

      // Show error alert
      setAlert({ open: true, message: "Error deleting learning objective", severity: "error" });
  }
};

  const handleEditProject = (project) => {
    setEditItem(project)
    setNewProjectName(project.name)
    setSelectedServiceDivisionId(project.serviceDivisionId)
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

  // Functions for editing sources and learning objectives
  const handleEditSource = (source) => {
    setEditItem(source)
    setNewSourceName(source.name)
    setIsEditMode(true)
    setIsAddSourceDialogOpen(true)
  }

  const handleEditLearningObjective = (objective) => {
    setEditItem(objective)
    setNewLearningObjectiveName(objective.name)
    setSelectedSourceId(objective.sourceId)
    setIsEditMode(true)
    setIsAddLearningObjectiveDialogOpen(true)
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleSkillSearchChange = (event) => {
    setSkillSearchTerm(event.target.value)
  }

  const handleObjectiveSearchChange = (event) => {
    setObjectiveSearchTerm(event.target.value)
  }

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode)
    }
  }

  const handleSortOrderChange = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  const handlePageChange = (itemId) => (event, value) => {
    setPage((prevState) => ({
      ...prevState,
      [itemId]: value,
    }))
  }

  const handleAccordionChange = (divisionId) => async (event, isExpanded) => {
    setExpandedServiceDivision(isExpanded ? divisionId : null)
    if (isExpanded) {
      await fetchProjects(divisionId)
    }
  }

  const handleTechStackAccordionChange = (techStackId) => async (event, isExpanded) => {
    setExpandedTechStack(isExpanded ? techStackId : null)
    if (isExpanded) {
      await fetchPrimarySkills(techStackId)
    }
  }

  const handleSourceAccordionChange = (sourceId) => async (event, isExpanded) => {
    setExpandedSource(isExpanded ? sourceId : null)
    if (isExpanded) {
      await fetchLearningObjectives(sourceId)
    }
  }

  const handleTechStackChange = (event) => {
    const stackId = event.target.value
    setSelectedTechStackId(stackId)
    fetchPrimarySkills(stackId)
  }

  const handleServiceDivisionChange = (event) => {
    const value = event.target.value
    if (value === "add_new") {
      setIsAddNewDivisionDialogOpen(true)
    } else {
      setSelectedServiceDivisionId(value)
    }
  }

  const handleSourceChange = (event) => {
    const value = event.target.value
    if (value === "add_new") {
      setIsAddNewSourceDialogOpen(true)
    } else {
      setSelectedSourceId(value)
    }
  }

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false })
  }

  // Filter projects by search term
  const filteredProjects = projects.filter((project) => project.name?.toLowerCase().includes(searchTerm.toLowerCase()))

  // Sort projects based on sort order
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.name.localeCompare(b.name)
    } else {
      return b.name.localeCompare(a.name)
    }
  })

  // Group projects by service division
  const groupedProjects = serviceDivisions.map((division) => {
    const divisionProjects = sortedProjects.filter((project) => project.serviceDivisionId === division.id)

    // Get current page for this division
    const currentPage = page[division.id] || 1

    // Paginate projects for this division
    const paginatedProjects = divisionProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    return {
      ...division,
      projects: divisionProjects,
      paginatedProjects,
      totalPages: Math.ceil(divisionProjects.length / itemsPerPage),
    }
  })

  // Filter primary skills by search term
  const filteredPrimarySkills = primarySkills.filter((skill) =>
    skill.name ? skill.name.toLowerCase().includes(skillSearchTerm.toLowerCase()) : false,
  )

  // Group primary skills by tech stack
  const groupedSkills = techStacks.map((techStack) => ({
    ...techStack,
    skills: filteredPrimarySkills.filter((skill) => skill.techStackId === techStack.id),
  }))

  // Filter learning objectives by search term
  const filteredLearningObjectives = learningObjectives.filter((objective) =>
    objective.name ? objective.name.toLowerCase().includes(objectiveSearchTerm.toLowerCase()) : false,
  )

  // Group learning objectives by source
  const groupedObjectives = sources.map((source) => {
    const sourceObjectives = filteredLearningObjectives.filter((objective) => objective.sourceId === source.id)

    // Get current page for this source
    const currentPage = page[source.id] || 1

    // Paginate objectives for this source
    const paginatedObjectives = sourceObjectives.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    return {
      ...source,
      objectives: sourceObjectives,
      paginatedObjectives,
      totalPages: Math.ceil(sourceObjectives.length / itemsPerPage),
    }
  })

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
              marginLeft: "25px",
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
            label="Primary Skills"
            sx={{
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: "400",
              minWidth: "120px",
            }}
          />
          <Tab
            label="Learning Objectives"
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
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<BusinessIcon />}
                    onClick={() => {
                      setIsEditMode(false)
                      setNewDivisionName("")
                      setIsAddDivisionDialogOpen(true)
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
                    Add Service Division
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setIsEditMode(false)
                      setNewProjectName("")
                      setSelectedServiceDivisionId("")
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

               
              </Box>

              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                  <CircularProgress size={40} sx={{ color: "#09459E" }} />
                </Box>
              ) : (
                <Paper
                  elevation={0}
                  sx={{
                    maxHeight: 600,
                    overflow: "auto",
                    mb: 3,
                    border: "1px solid #f0f0f0",
                    borderRadius: "10px",
                  }}
                >
                  {groupedProjects.length === 0 ? (
                    <Box sx={{ p: 3, textAlign: "center" }}>
                      <Typography color="text.secondary" sx={{ fontStyle: "italic" }}>
                        No service divisions found. Please add a service division first.
                      </Typography>
                    </Box>
                  ) : (
                    groupedProjects.map((division) => (
                      <Accordion
                        key={division.id}
                        expanded={expandedServiceDivision === division.id}
                        onChange={handleAccordionChange(division.id)}
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
                            <Typography sx={{ fontWeight: 500 }}>{division.name}</Typography>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Badge badgeContent={division.projects.length} color="primary" sx={{ mr: 2 }} />
                              <Box>
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleEditDivision(division)
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
                                    handleDeleteDivision(division.id)
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
                          {viewMode === "list" ? (
                            <List dense>
                              {division.paginatedProjects.length > 0 ? (
                                division.paginatedProjects.map((project) => (
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
                                      "&:last-child": {
                                        borderBottom: "none",
                                      },
                                    }}
                                  >
                                    <ListItemText primary={project.name} />
                                  </ListItem>
                                ))
                              ) : (
                                <ListItem>
                                  <ListItemText
                                    primary="No projects found for this service division"
                                    sx={{ color: "text.secondary", fontStyle: "italic", textAlign: "center" }}
                                  />
                                </ListItem>
                              )}
                            </List>
                          ) : (
                            <Box sx={{ p: 2 }}>
                              <Grid container spacing={2}>
                                {division.paginatedProjects.length > 0 ? (
                                  division.paginatedProjects.map((project) => (
                                    <Grid item xs={12} sm={6} md={4} key={project.id}>
                                      <Card
                                        className="card-content"
                                        sx={{
                                          height: "100%",
                                          gap: "12px",
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
                                        <CardContent sx={{ flexGrow: 1, p: 2, mb: 10 }}>
                                          <Typography
                                            variant="h6"
                                            component="div"
                                            sx={{ mb: 1, fontSize: "1rem", fontWeight: 500 }}
                                          >
                                            {project.name}
                                          </Typography>
                                          <Typography variant="caption" color="text.secondary">
                                            ID: {project.id}
                                          </Typography>
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
                                  ))
                                ) : (
                                  <Grid item xs={12}>
                                    <Box sx={{ p: 3, textAlign: "center" }}>
                                      <Typography color="text.secondary" sx={{ fontStyle: "italic" }}>
                                        No projects found for this service division
                                      </Typography>
                                    </Box>
                                  </Grid>
                                )}
                              </Grid>
                            </Box>
                          )}

                          {division.totalPages > 1 && (
                            <Box
                              sx={{ display: "flex", justifyContent: "center", p: 2, borderTop: "1px solid #f0f0f0" }}
                            >
                              <Pagination
                                count={division.totalPages}
                                page={page[division.id] || 1}
                                onChange={handlePageChange(division.id)}
                                color="primary"
                                size="small"
                                sx={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                  "& .MuiPaginationItem-root": {
                                    color: "#09459E",
                                  },
                                  "& .Mui-selected": {
                                    backgroundColor: "rgba(9, 69, 158, 0.1) !important",
                                    color: "red",
                                  },
                                }}
                              />
                            </Box>
                          )}
                        </AccordionDetails>
                      </Accordion>
                    ))
                  )}
                </Paper>
              )}
            </Box>
          )}

          {tabValue === 1 && (
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
                    onChange={handleTechStackAccordionChange(techStack.id)}
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

          {tabValue === 2 && (
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 500, color: "#333" }}>
                  Learning Objectives
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<MenuBookIcon />}
                    onClick={() => {
                      setIsEditMode(false)
                      setNewSourceName("")
                      setIsAddSourceDialogOpen(true)
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
                    Add Source
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setIsEditMode(false)
                      setNewLearningObjectiveName("")
                      setSelectedSourceId("")
                      setIsAddLearningObjectiveDialogOpen(true)
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
                    Add Learning Objective
                  </Button>
                </Box>
              </Box>

              <TextField
                placeholder="Search learning objectives..."
                variant="outlined"
                size="small"
                fullWidth
                value={objectiveSearchTerm}
                onChange={handleObjectiveSearchChange}
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
                {groupedObjectives.map((source) => (
                  <Accordion
                    key={source.id}
                    expanded={expandedSource === source.id}
                    onChange={handleSourceAccordionChange(source.id)}
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
                        <Typography sx={{ fontWeight: 500 }}>{source.name}</Typography>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Badge badgeContent={source.objectives.length} color="primary" sx={{ mr: 2 }} />
                          <Box>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditSource(source)
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
                                handleDeleteSource(source.id)
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
                        {source.paginatedObjectives.length > 0 ? (
                          source.paginatedObjectives.map((objective) => (
                            <ListItem
                              key={objective.id}
                              secondaryAction={
                                <Box>
                                  <IconButton
                                    edge="end"
                                    aria-label="edit"
                                    onClick={() => handleEditLearningObjective(objective)}
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
                                    onClick={() => handleDeleteLearningObjective(objective.id)}
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
                              <ListItemText primary={objective.name} />
                            </ListItem>
                          ))
                        ) : (
                          <ListItem>
                            <ListItemText
                              primary="No learning objectives found for this source"
                              sx={{ color: "text.secondary", fontStyle: "italic", textAlign: "center" }}
                            />
                          </ListItem>
                        )}
                      </List>

                      {source.totalPages > 1 && (
                        <Box sx={{ display: "flex", justifyContent: "center", p: 2, borderTop: "1px solid #f0f0f0" }}>
                          <Pagination
                            count={source.totalPages}
                            page={page[source.id] || 1}
                            onChange={handlePageChange(source.id)}
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
                      )}
                    </AccordionDetails>
                  </Accordion>
                ))}
                {groupedObjectives.length === 0 && (
                  <Box sx={{ p: 3, textAlign: "center" }}>
                    <Typography color="text.secondary" sx={{ fontStyle: "italic" }}>
                      No sources found
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
  <label htmlFor="service-division-select" style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
    Service Division
  </label>
  <select
    id="service-division-select"
    value={selectedServiceDivisionId}
    onChange={handleServiceDivisionChange}
    style={{
      width: '98%',
      height: '36px',
      fontSize: '12px',
      marginBottom: '1rem',
      padding: '8px 12px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      outline:"none"
    }}
  >
    <option value="" disabled>
      <em style={{ color: '#BDBDBD' }}>Select Service Division</em>
    </option>
    {serviceDivisions.map((division) => (
      <option key={division.id} value={division.id}>
        {division.name}
      </option>
    ))}
    <option value="add_new" style={{ color: '#09459E', fontWeight: 'bold' }}>
      + Add New Service Division
    </option>
  </select>

  <label htmlFor="project-name" style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
    Project Name
  </label>
  <input
    id="project-name"
    type="text"
    placeholder="Project Name"
    value={newProjectName}
    onChange={(e) => setNewProjectName(e.target.value)}
    style={{
      width: '98%',
      padding: '8px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      marginBottom: '1rem',
      fontSize: '12px',
      outline:"none",
    }}
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
            disabled={!selectedServiceDivisionId || !newProjectName.trim()}
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

      {/* Add New Service Division Dialog */}
      <Dialog
        open={isAddNewDivisionDialogOpen || isAddDivisionDialogOpen}
        onClose={() => {
          setIsAddNewDivisionDialogOpen(false)
          setIsAddDivisionDialogOpen(false)
        }}
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
  <label htmlFor="service-division-input" style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
    Service Division
  </label>
  <input
    id="service-division-input"
    autoFocus
    type="text"
    placeholder="Service Division Name"
    value={newDivisionName}
    onChange={(e) => setNewDivisionName(e.target.value)}
    style={{
      width: '97%',
      border: '1px solid #ccc',
      borderRadius: '4px',
      padding: '6px 10px 8px 10px',
      outline:"none",
    }}
  />
</DialogContent>


        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={() => {
              setIsAddNewDivisionDialogOpen(false)
              setIsAddDivisionDialogOpen(false)
            }}
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
            disabled={!newDivisionName.trim()}
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
        <label htmlFor="tech-stack-name" style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
    Tech Stack Name
  </label>
  <input
    id="tech-stack-name"
    type="text"
    value={newTechStackName}
    onChange={(e) => setNewTechStackName(e.target.value)}
    style={{
      width: '98%',
      height: '30px',
      marginBottom: '1rem',
      borderRadius: '4px',
      border: '1px solid #ccc',
      fontSize: '12px',
      outline: 'none',
      padding: '0 8px',
    }}
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
            disabled={!newTechStackName.trim()}
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
  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    {/* Simple HTML input for Tech Stack */}
    <div style={{ width: '100%' }}>
      <label htmlFor="tech-stack-input" style={{ display: 'block', marginBottom: '8px', fontWeight: '500' , fontSize:"14px"}}>
        Tech Stack
      </label>
      <select
        id="tech-stack-input"
        placeholder="Select Tech Stack"
        value={selectedTechStackId}
        onChange={handleTechStackChange}
        style={{
          width: '100%',
          height: '30px',
          marginBottom: '1rem',
          borderRadius: '4px',
          border: '1px solid #ccc',
          fontSize: '12px',
          color:selectedTechStackId? 'black': '#6C6868', // Change color based on selection
         outline: 'none',
         "&:hover": {
          backgroundColor: "#083a80",
        },
         
        }}
      >
        <option value="" disabled style={{color: '#BDBDBD'}} >Select Tech Stack</option>
        {techStacks.map((techStack) => (
          <option key={techStack.id} value={techStack.id} style={{color: 'black'}}>
            {techStack.name}
          </option>
        ))}
      </select>
    </div>
 
    {/* Add New Tech Stack Button */}
    <Tooltip title="Add New Tech Stack">
      <Fab
        size="small"
        color="primary"
        onClick={() => {
          setIsAddPrimarySkillDialogOpen(false);
          setIsAddTechStackDialogOpen(true);
        }}
        sx={{
          marginTop: '1rem',
          backgroundColor: "#09459E",
     
          height: 'auto',
          width: '2.5rem',
          boxShadow: "none",
          marginBottom: '0.2rem',
          "&:hover": { backgroundColor: "#083a80" },
         
        }}
      >
        <AddIcon sx={{height:'2rem', width: '1rem'}} />
      </Fab>
    </Tooltip>
  </Box>
 
 
  <label htmlFor="tech-stack-input" style={{ display: 'block', marginBottom: '8px', fontWeight: '500' , fontSize:"14px"}}>
    Primary Skill
      </label>
  {/* Simple HTML input for Primary Skill Name */}
  <input
    autoFocus
    type="text"
    placeholder="Primary Skill Name"
    value={newPrimarySkillName}
    onChange={(e) => setNewPrimarySkillName(e.target.value)}
    style={{
      width: '89%',
      height: '30px',
   
      // padding: '10px',
      marginBottom: '16px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      fontSize: '12px',
      outline: 'none',
     
    }}
  />
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

      {/* Add Source Dialog */}
      <Dialog
        open={isAddSourceDialogOpen}
        onClose={() => setIsAddSourceDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: "10px",
            maxWidth: "500px",
            width: "100%",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 500, borderBottom: "1px solid #f0f0f0", pb: 2 }}>
          {isEditMode ? "Edit Source" : "Add New Source"}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Source Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newSourceName}
            onChange={(e) => setNewSourceName(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={() => setIsAddSourceDialogOpen(false)}
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
            onClick={handleAddSource}
            variant="contained"
            disabled={!newSourceName.trim()}
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

      {/* Add Learning Objective Dialog */}
      <Dialog
        open={isAddLearningObjectiveDialogOpen}
        onClose={() => setIsAddLearningObjectiveDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: "10px",
            maxWidth: "500px",
            width: "100%",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 500, borderBottom: "1px solid #f0f0f0", pb: 2 }}>
          {isEditMode ? "Edit Learning Objective" : "Add New Learning Objective"}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <FormControl fullWidth>
              <FormLabel htmlFor="source-input" sx={{ display: "block", mb: 1, fontWeight: 500, fontSize: "14px" }}>
                Source
              </FormLabel>
              <Select
                id="source-input"
                value={selectedSourceId}
                onChange={handleSourceChange}
                displayEmpty
                fullWidth
                sx={{
                  height: "36px",
                  fontSize: "12px",
                  "& .MuiSelect-select": {
                    padding: "8px 12px",
                  },
                }}
              >
                <MenuItem value="" disabled>
                  <em style={{ color: "#BDBDBD" }}>Select Source</em>
                </MenuItem>
                {sources.map((source) => (
                  <MenuItem key={source.id} value={source.id}>
                    {source.name}
                  </MenuItem>
                ))}
                <MenuItem value="add_new" sx={{ color: "#09459E", fontWeight: "bold" }}>
                  + Add New Source
                </MenuItem>
              </Select>
            </FormControl>

            <Tooltip title="Add New Source">
              <Fab
                size="small"
                color="primary"
                onClick={() => {
                  setIsAddLearningObjectiveDialogOpen(false)
                  setIsAddSourceDialogOpen(true)
                }}
                sx={{
                  marginTop: "1.5rem",
                  backgroundColor: "#09459E",
                  height: "36px",
                  width: "36px",
                  boxShadow: "none",
                  "&:hover": { backgroundColor: "#083a80" },
                }}
              >
                <AddIcon />
              </Fab>
            </Tooltip>
          </Box>

          <TextField
            autoFocus
            margin="dense"
            label="Learning Objective Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newLearningObjectiveName}
            onChange={(e) => setNewLearningObjectiveName(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={() => setIsAddLearningObjectiveDialogOpen(false)}
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
            onClick={handleAddLearningObjective}
            variant="contained"
            sx={{
              backgroundColor: "#09459E",
              textTransform: "none",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#083a80",
              },
            }}
            disabled={!selectedSourceId || !newLearningObjectiveName.trim()}
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

