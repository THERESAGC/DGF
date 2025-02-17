const serviceDivisionService = require('../services/serviceDivisionService');

// Controller method to fetch all services
exports.getAllServices = async (req, res) => {
    try {
        // Fetch all service divisions from the service_division table
        const services = await serviceDivisionService.getAllServices();

        // Check if there are any services in the database
        if (services.length === 0) {
            return res.status(404).json({ message: 'No services found.' });
        }

        // Return the services as a JSON response
        res.status(200).json({ services: services });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
