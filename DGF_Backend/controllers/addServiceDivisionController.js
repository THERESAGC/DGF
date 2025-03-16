const { addSeviceDivision } = require('../services/addServiceDivisionService');

const addServiceDivisionController = async (req, res) => {
    const { service_name } = req.body;

    try {
        const result = await addSeviceDivision(service_name);
        res.status(201).json({ message: 'Service division added successfully', data: result });
    } catch (error) {
        res.status(500).json({ message: 'Error adding service division', error: error.message });
    }
};

module.exports = {
    addServiceDivisionController
};