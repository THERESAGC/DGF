const axios = require('axios');
const db = require('../config/db');
require('dotenv').config();
 
const getMatrixProjects = async () => {
    try {
        const date = new Date().toISOString().split('T')[0]; // Get today's date in 'YYYY-MM-DD' format
        const tokenString = `2022#@1academy${date}!@#$%^`;
        const token = Buffer.from(tokenString).toString('base64');
        const url = `https://matrix.harbinger-systems.com/academy_get_data.php?id=${token}`;

        const response = await axios.get(url, {
            httpsAgent: new (require('https').Agent)({
                rejectUnauthorized: false
            })
        });

        const data = response.data;

        // Extract unique project names
        const projectNames = new Set();

        data.forEach(item => {
            if (item.projectlists && Array.isArray(item.projectlists)) {
                item.projectlists.forEach(project => {
                    projectNames.add(project);
                });
            }
        });

        // Insert unique project names into the database
        const checkQuery = 'SELECT COUNT(*) AS count FROM projectname WHERE ProjectName = ?';
        const insertQuery = 'INSERT INTO projectname (ProjectName, service_division_id) VALUES (?, ?)';

        for (const projectName of projectNames) {
            try {
                // Check if the project name already exists
                const [rows] = await db.promise().execute(checkQuery, [projectName]);
                if (rows[0].count === 0) {
                    // Insert the project name if it doesn't exist
                    await db.promise().execute(insertQuery, [projectName, 2]);
                } else {
                    console.log(`Project name "${projectName}" already exists in the database.`);
                }
            } catch (error) {
                console.error(`Error processing project name "${projectName}":`, error);
            }
        }

        console.log('Unique project names inserted into the database');
    } catch (error) {
        console.error('Error fetching data from Matrix Project API:', error);
    }
};

module.exports = { getMatrixProjects };