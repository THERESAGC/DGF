const db = require('../config/db');

const updateUserRole = (emp_id, role_name) => {
    return new Promise((resolve, reject) => {
        // Step 1: Get the role ID from the role table
        const getRoleIdQuery = `SELECT role_id FROM role WHERE role_name = ?`;
        db.execute(getRoleIdQuery, [role_name], (err, results) => {
            if (err) {
                console.error('Error fetching role ID:', err);
                return reject(err);
            }

            if (results.length === 0) {
                console.error('Role not found for role_name:', role_name);
                return reject(new Error('Role not found'));
            }

            const role_id = results[0].role_id;
            console.log('Fetched role_id:', role_id);

            // Step 2: Update the role_id in the logintable
            const updateRoleQuery = `UPDATE logintable SET role_id = ? WHERE emp_id = ?`;
            db.execute(updateRoleQuery, [role_id, emp_id], (err, results) => {
                if (err) {
                    console.error('Error updating role ID in logintable:', err);
                    return reject(err);
                }

                resolve(results);
            });
        });
    });
};

module.exports = {
    updateUserRole
};