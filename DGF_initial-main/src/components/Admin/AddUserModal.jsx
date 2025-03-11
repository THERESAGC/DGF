import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Radio, 
  RadioGroup, 
  FormControlLabel, 
  FormControl, 
  FormLabel, 
  Select, 
  MenuItem, 
  Paper, 
  Grid, 
  Button,
  Avatar,
  Modal
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const AddUserModal = ({ open, onClose }) => {
  const [role, setRole] = useState('');
  const [employee, setEmployee] = useState('');

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleEmployeeChange = (event) => {
    setEmployee(event.target.value);
  };

  const employeeDetails = {
    "Jonathan Hart": {
      designation: "Marketing Executive",
      userId: "HS1232",
      email: "jonathan@xyz.com"
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ maxWidth: 600, p: 3, mx: 'auto', mt: 5, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 500, mb: 3 }}>
          Add User
        </Typography>
        
        <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 3 }}>
          <FormControl component="fieldset" sx={{ width: '100%', mb: 3 }}>
            <FormLabel component="legend" required sx={{ 
              color: 'black', 
              fontSize: '0.875rem',
              mb: 1
            }}>
              Select Role
            </FormLabel>
            <RadioGroup
              row
              name="role-radio-group"
              value={role}
              onChange={handleRoleChange}
            >
              <FormControlLabel 
                value="capdev" 
                control={<Radio size="small" />} 
                label="Capdev" 
                sx={{ mr: 3 }}
              />
              <FormControlLabel 
                value="spoc" 
                control={<Radio size="small" />} 
                label="SPOC" 
                sx={{ mr: 3 }}
              />
              <FormControlLabel 
                value="user" 
                control={<Radio size="small" />} 
                label="User (DM/DH)" 
              />
            </RadioGroup>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <FormLabel component="legend" required sx={{ 
              color: 'black', 
              fontSize: '0.875rem',
              mb: 1
            }}>
              Select Employee
            </FormLabel>
            <Select
              value={employee}
              onChange={handleEmployeeChange}
              displayEmpty
              IconComponent={KeyboardArrowDownIcon}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar 
                    src="/placeholder.svg?height=30&width=30" 
                    alt={selected || "Placeholder"}
                    sx={{ width: 24, height: 24, mr: 1 }}
                  />
                  {selected || "Select Employee"}
                </Box>
              )}
              sx={{ 
                height: 40,
                '.MuiOutlinedInput-notchedOutline': {
                  borderColor: '#e0e0e0',
                }
              }}
            >
              <MenuItem value="Jonathan Hart">Jonathan Hart</MenuItem>
            </Select>
          </FormControl>

          <Paper 
            elevation={0} 
            sx={{ 
              backgroundColor: '#f9f9f9', 
              p: 3, 
              borderRadius: 1,
              mb: 3,
              minHeight: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }}
          >
            {employee ? (
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Designation
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {employeeDetails[employee].designation}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    User ID
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {employeeDetails[employee].userId}
                  </Typography>
                </Grid>
                <Grid item xs={12} sx={{ mt: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Email
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {employeeDetails[employee].email}
                  </Typography>
                </Grid>
              </Grid>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Selected employee details will be shown here
              </Typography>
            )}
          </Paper>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button 
              variant="text" 
              sx={{ 
                color: '#1976d2',
                textTransform: 'none',
                fontWeight: 400
              }}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              sx={{ 
                backgroundColor: '#1976d2',
                textTransform: 'none',
                minWidth: 80,
                boxShadow: 'none'
              }}
            >
              Add
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddUserModal;