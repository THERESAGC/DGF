const db = require('../config/db');

// Function to get all project names from the database
const getLoginDetails = () => {
    return new Promise((resolve, reject) => {
        const query = `
SELECT 
        l.emp_id,
        l.name,
        l.email,
        l.password,
        l.profile_image,
        l.created_on,
        l.status,
        r.role_name
      FROM logintable l
      LEFT JOIN role r ON l.role_id = r.role_id
    `;

        db.execute(query, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = {
    getLoginDetails
};
