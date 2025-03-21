const mysql = require('mysql2');
const db = require('../config/db'); // Assuming you have a db configuration file

// Function to get employee details by ID
const getEmployeeDetailsById = async (id) => {
    try {
        const query = `
            SELECT 
                e.emp_name, 
                e.emp_email, 
                e.profile_image, 
                e.Designation_Name, 
                e.emp_id, 
                r.role_name AS system_role
            FROM employee e
            JOIN logintable l ON e.emp_id = l.emp_id
            JOIN role r ON l.role_id = r.role_id
            WHERE e.emp_id = ?
        `;
        const connection = await db.promise();
        const [rows] = await connection.query(query, [id]);
        return rows[0];
    } catch (error) {
        console.error('Error executing query', error);
        throw error;
    }
};

module.exports = {
    getEmployeeDetailsById
};