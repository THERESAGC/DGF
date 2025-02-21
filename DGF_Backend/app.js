const express = require('express');
const cors = require('cors');
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

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/role', roleRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/techstack', techstackRoutes);
app.use('/api/primaryskill', primarySkillRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/employee', employeeSearchByEmailRoutes);
app.use('/api', serviceDivisionRoutes);
app.use('/api/employee-level', employeeLevelRoutes);
app.use('/api/newtrainingrequest', newTrainingRequestRoutes);
app.use('/api/training-request', trainingRequestEmployeeLevelRoutes);
app.use('/api/get-max-request-id', getMaxRequestIdRoutes);
app.use('/api/training-requests', getAllTrainingRequestsRoutes);
app.use('/api/empNewTrainingRequested', empNewTrainingRequestedRoutes);
app.use('/api/trainingRequestPrimarySkills', trainingRequestPrimarySkillRoutes);
app.use('/api/employeeSearchByName', employeeRoutes);
app.use('/api/managerSearchByName', managerSearchByNameRoutes);
app.use('/api/getEmpNewTrainingRequested', getEmpNewTrainingRequestedRoutes);
app.use('/api/request-status', requestStatusRoutes);
app.use('/api/getAllTrainingRequests', getAllTrainingRequestsRoutes);
app.use('/api', getTrainingRequestDetailsRoutes);
app.use('/api/employeeSearchByEmail', employeeSearchByEmailRoutes); // Add the new route

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});