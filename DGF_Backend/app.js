// app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const authRoutes = require('./routes/authRoutes');
const roleRoutes = require('./routes/roleRoutes');
const trainingRoutes = require('./routes/trainingObjectivesRoutes');
const techstackRoutes = require('./routes/techstackRoutes'); // Import the techstack routes
const primarySkillRoutes = require('./routes/primarySkillRoutes'); // Import the primary skill routes
const projectRoutes = require('./routes/projectRoutes'); // Import the project routes
const employeeRoutes = require('./routes/employeeSearchByNameRoutes'); // Import the employee routes
const employeeSearchByEmailRoutes = require('./routes/employeeSearchByEmailRoutes'); // Import the employee search by email routes
const serviceDivisionRoutes = require('./routes/serviceDivisionRoutes');  // Import the routes for service division
const employeeLevelRoutes = require('./routes/employeeLevelRoutes'); // Import the employee level routes
const newTrainingRequestRoutes = require('./routes/newTrainingRequestRoutes'); // Import the new training request routes
const trainingRequestEmployeeLevelRoutes = require('./routes/trainingRequestEmployeeLevelRoutes');
const getMaxRequestIdRoutes = require('./routes/getMaxRequestIdRoutes');
const getAllTrainingRequestsRoutes = require('./routes/getAllTrainingRequestsRoutes');
const empNewTrainingRequestedRoutes = require('./routes/empNewTrainingRequestedRoutes');
const trainingRequestPrimarySkillRoutes = require('./routes/trainingRequestPrimarySkillRoutes');


// Create an instance of the express app
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json()); // Built-in Express middleware to parse JSON request bodies

// Enable CORS for all routes
app.use(cors()); // Use the cors middleware

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/role', roleRoutes); // Role-related routes
app.use('/api/training', trainingRoutes); // Training-related routes
app.use('/api/techstack', techstackRoutes); // Tech stack-related routes
app.use('/api/primaryskill', primarySkillRoutes); // Primary skill-related routes
app.use('/api/project', projectRoutes); // Project-related routes
app.use('/api/employee', employeeRoutes); // Employee-related routes
app.use('/api/employee', employeeSearchByEmailRoutes); // Employee search by email route
app.use('/api', serviceDivisionRoutes);
app.use('/api/employee-level', employeeLevelRoutes); // Employee level routes
app.use('/api/newtrainingrequest', newTrainingRequestRoutes); // New training request route
app.use('/api/training-request', trainingRequestEmployeeLevelRoutes);
app.use('/api/get-max-request-id', getMaxRequestIdRoutes); // New route for max request ID
app.use('/api/training-requests', getAllTrainingRequestsRoutes); // Route for training requests
app.use('/api/empNewTrainingRequested', empNewTrainingRequestedRoutes);
app.use('/api/trainingRequestPrimarySkills', trainingRequestPrimarySkillRoutes);


// Error handling middleware (optional but useful for debugging)
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
