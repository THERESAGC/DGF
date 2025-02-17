const getMaxRequestIdService = require('../services/getMaxRequestIdService');

exports.getMaxRequestId = async (req, res) => {
    try {
        // Get the max requestid and increment it by 1
        const newRequestId = await getMaxRequestIdService.getMaxRequestId();
        
        // Return the new requestid
        res.status(200).json({
            message: 'Max Request ID fetched successfully',
            newRequestId
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
