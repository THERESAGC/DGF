const empNewTrainingRequestedService = require('../services/empNewTrainingRequestedService');

exports.createEmpNewTrainingRequested = async (req, res) => {
    const data = req.body;  // Expect an array of records

    // Validate incoming data
    if (!Array.isArray(data) || data.some(item => !item.emp_id || !item.availablefrom || !item.dailyband || item.availableonweekend === undefined || !item.requestid)) {
        return res.status(400).json({ message: 'All fields are required for each record.' });
    }

    try {
        // Initialize an array to store the result for each employee
        const results = [];

        // Loop through each record and insert it
        for (const record of data) {
            try {
                const result = await empNewTrainingRequestedService.insertEmpNewTrainingRequested(
                    record.emp_id,
                    record.availablefrom,
                    record.dailyband,
                    record.availableonweekend,
                    record.requestid
                );
                results.push({ emp_id: record.emp_id, success: true, message: 'Data inserted successfully', result });
            } catch (err) {
                results.push({ emp_id: record.emp_id, success: false, message: 'Error inserting data', error: err.message });
            }
        }

        // Respond with the results for all records
        res.status(201).json({ message: 'Bulk data insertion results', data: results });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
