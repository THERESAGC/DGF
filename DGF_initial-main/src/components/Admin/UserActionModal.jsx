
import { useState, useEffect } from "react"
import {
  Box, Typography, Modal, Button, FormControl, FormLabel, Select, MenuItem,
  Switch, Divider, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import axios from "axios"
 
const UserActionModal = ({ open, onClose, user }) => {
  const [roles, setRoles] = useState([])
  const [selectedRole, setSelectedRole] = useState("")
  const [status, setStatus] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showRoleConfirmation, setShowRoleConfirmation] = useState(false)
  const [newRole, setNewRole] = useState('')
  const [oldRole, setOldRole] = useState('')
 
  useEffect(() => {
    if (open && user) {
      setSelectedRole(user.role || "")
      setStatus(user.status === "active")
     
      const fetchRoles = async () => {
        try {
          const response = await axios.get("http://localhost:8000/api/getallroles/getAllRoles")
          setRoles(response.data)
        } catch (error) {
          console.error("Error fetching roles:", error)
        }
      }
      fetchRoles()
    }
  }, [open, user])
 
  const handleRoleChange = (event) => {
    const selectedNewRole = event.target.value
    setNewRole(selectedNewRole)
    setOldRole(selectedRole)
    setShowRoleConfirmation(true)
  }
 
  const handleStatusChange = (event) => {
    setStatus(event.target.checked)
  }
 
  const handleConfirmRoleChange = () => {
    setSelectedRole(newRole)
    setShowRoleConfirmation(false)
  }
 
  const handleSave = async () => {
    if (!user) return
    setLoading(true)
    try {
      // Update status
      await axios.put(`http://localhost:8000/api/user/update-status`, {
        userId: user.id,
        status: status ? "active" : "inactive",
      })
     
      // Update role
      await axios.put(`http://localhost:8000/api/users/update-role`, {
        emp_id: user.id,
        role_name: selectedRole,
      })
     
      alert("User updated successfully")
      onClose()
    } catch (error) {
      console.error("Error updating user:", error)
      alert("Error updating user")
    } finally {
      setLoading(false)
    }
  }
 
  const handleResendInvitation = async () => {
    if (!user) return
    setLoading(true)
    try {
      await axios.post(`http://localhost:8000/api/users/${user.id}/resend-invitation`)
      alert("Invitation sent successfully")
    } catch (error) {
      console.error("Error sending invitation:", error)
      alert("Error sending invitation")
    } finally {
      setLoading(false)
    }
  }
 
  if (!user) return null
 
  return (
    <>
      <Modal open={open} onClose={onClose} aria-labelledby="user-action-modal-title">
        <Box sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: "10px",
          boxShadow: 24,
          p: 3,
          fontFamily: '"Poppins", sans-serif',
        }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography id="user-action-modal-title" variant="h6" component="h2" sx={{ fontWeight: 500 }}>
              Edit User
            </Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              User: {user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </Box>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <FormLabel component="legend" sx={{
              color: "black",
              fontSize: "0.875rem",
              mb: 1,
              fontWeight: 500,
            }}>
              Role
            </FormLabel>
            <Select
              value={selectedRole}
              onChange={handleRoleChange}
              displayEmpty
              IconComponent={KeyboardArrowDownIcon}
              renderValue={(selected) => selected}
              sx={{
                height: 30,
                fontSize: "12px",
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: "#e0e0e0",
                  
                  
                },
              }}
            >
              {roles.map((role) => (
                <MenuItem  key={role.role_id} value={role.role_name}>
                  {role.role_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <FormLabel component="legend" sx={{
              color: "black",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}>
              Status
            </FormLabel>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body2" color={status ? "text.secondary" : "#AA1700"} sx={{ mr: 1 }}>
                Inactive
              </Typography>
              <Switch checked={status} onChange={handleStatusChange} color="primary" />
              <Typography variant="body2" color={status ? "#2BB381" : "text.secondary"} sx={{ ml: 1 }}>
                Active
              </Typography>
            </Box>
          </Box>
          {user.status === "invited" && (
            <Box sx={{ mb: 3 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={handleResendInvitation}
                disabled={loading}
                sx={{
                  textTransform: "none",
                  borderColor: "#09459E",
                  color: "#09459E",
                  "&:hover": {
                    borderColor: "#09459E",
                    backgroundColor: "rgba(9, 69, 158, 0.04)",
                  },
                }}
              >
                Resend Invitation Email
              </Button>
            </Box>
          )}
          <Divider sx={{ mb: 3 }} />
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button
              variant="text"
              onClick={onClose}
              disabled={loading}
              sx={{
                color: "#09459E",
                textTransform: "none",
                fontWeight: 400,
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={loading}
              sx={{
                backgroundColor: "#09459E",
                textTransform: "none",
                minWidth: 80,
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#083a80",
                  boxShadow: "none",
                },
              }}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
 
      {/* Role Change Confirmation Dialog */}
      <Dialog
        open={showRoleConfirmation}
        onClose={() => setShowRoleConfirmation(false)}
      >
        <DialogTitle>Confirm Role Change</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to change {user?.name}'s role from {oldRole} to {newRole}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRoleConfirmation(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmRoleChange}
            color="primary"
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
 
export default UserActionModal
 