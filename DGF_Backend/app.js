const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');

const authRoutes = require('./routes/authRoutes');
const roleRoutes = require('./routes/roleRoutes');
const trainingRoutes = require('./routes/trainingObjectivesRoutes');
const techstackRoutes = require('./routes/techstackRoutes');
const primarySkillRoutes = require('./routes/primarySkillRoutes');
const projectRoutes = require('./routes/projectRoutes');
const employeeRoutes = require('./routes/employeeSearchByNameRoutes');
const employeeSearchByEmailRoutes = require('./routes/employeeSearchByEmailRoutes');
const serviceDivisionRoutes = require('./routes/serviceDivisionRoutes');
const employeeLevelRoutes = require('./routes/employeeLevelRoutes');
const newTrainingRequestRoutes = require('./routes/newTrainingRequestRoutes');
const trainingRequestEmployeeLevelRoutes = require('./routes/trainingRequestEmployeeLevelRoutes');
const getMaxRequestIdRoutes = require('./routes/getMaxRequestIdRoutes');
const getAllTrainingRequestsRoutes = require('./routes/getAllTrainingRequestsRoutes');
const empNewTrainingRequestedRoutes = require('./routes/empNewTrainingRequestedRoutes');
const trainingRequestPrimarySkillRoutes = require('./routes/trainingRequestPrimarySkillRoutes');
const managerSearchByNameRoutes = require('./routes/managerSearchByNameRoutes');
const getEmpNewTrainingRequestedRoutes = require('./routes/getEmpNewTrainingRequestedRoutes');
const requestStatusRoutes = require('./routes/requestStatusRoutes');
const getTrainingRequestDetailsRoutes = require('./routes/getTrainingRequestDetailsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const commentRoutes = require('./routes/commentRoutes');
const empdetailsforcommentsRoutes = require('./routes/getEmpDetailsCommentRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:5173",  // Update with the URL where your frontend is running
        methods: ["GET", "POST"]
    }
});

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Authentication routes
app.use('/api/auth', authRoutes);

// Role management routes
app.use('/api/role', roleRoutes);

// Training objectives routes
app.use('/api/training', trainingRoutes);

// Tech stack routes
app.use('/api/techstack', techstackRoutes);

// Primary skill routes
app.use('/api/primaryskill', primarySkillRoutes);

// Project routes
app.use('/api/project', projectRoutes);

// // Employee search by name routes
// app.use('/api/employee', employeeRoutes);

app.use('/api/employeeSearchByName', employeeRoutes);

// Employee search by email routes
app.use('/api/employee', employeeSearchByEmailRoutes);

// Service division routes
app.use('/api', serviceDivisionRoutes);

// Employee level routes
app.use('/api/employee-level', employeeLevelRoutes);

// New training request routes
app.use('/api/newtrainingrequest', newTrainingRequestRoutes);

// Training request employee level routes
app.use('/api/training-request', trainingRequestEmployeeLevelRoutes);

// Get max request ID routes
app.use('/api/get-max-request-id', getMaxRequestIdRoutes);

// Get all training requests routes
app.use('/api/training-requests', getAllTrainingRequestsRoutes);

// Employee new training requested routes
app.use('/api/empNewTrainingRequested', empNewTrainingRequestedRoutes);

// Training request primary skills routes
app.use('/api/trainingRequestPrimarySkills', trainingRequestPrimarySkillRoutes);

// Manager search by name routes
app.use('/api/managerSearchByName', managerSearchByNameRoutes);

// Get employee new training requested routes
app.use('/api/getEmpNewTrainingRequested', getEmpNewTrainingRequestedRoutes);

// Request status routes
app.use('/api/request-status', requestStatusRoutes);

// Get all training requests routes (duplicate, consider removing one)
app.use('/api/getAllTrainingRequests', getAllTrainingRequestsRoutes);

// Training request details routes
app.use('/api', getTrainingRequestDetailsRoutes);

// Notification routes
app.use('/api/notifications', notificationRoutes);

// Comment routes
app.use('/api/comments', commentRoutes);

// Employee details for comments routes
app.use('/api/getempdetails', empdetailsforcommentsRoutes);

// WebSocket connection for real-time updates
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});