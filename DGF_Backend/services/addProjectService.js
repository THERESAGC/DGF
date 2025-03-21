const db = require('../config/db');
 
const addProject = async (projectName, serviceDivisionId) => {
    const checkQuery = 'SELECT COUNT(*) AS count FROM service_division WHERE id = ?';
    try {
        // Check if the service division exists
        const [rows] = await db.promise().execute(checkQuery, [serviceDivisionId]);
        const count = rows[0]?.count;
        if (count === 0) {
            throw new Error('Invalid service_division_id. No such service division exists.');
        }
 
        // Insert the project into the correct table with service_division_id
        const query = 'INSERT INTO projectname (ProjectName, service_division_id) VALUES (?, ?)';
        const [result] = await db.promise().execute(query, [projectName, serviceDivisionId]);
 
        return result.insertId;
    } catch (error) {
        console.error('Error adding project:', error);
        throw error;
    }
};
 
module.exports = {
    addProject
};