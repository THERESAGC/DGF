// services/primarySkillService.js
const db = require('../config/db');

// Function to get all primary skills by tech stack ID
const getPrimarySkillsByStack = (stack_id) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT skill_id, skill_name
            FROM primaryskill
            WHERE stack_id = ?
        `;

        db.execute(query, [stack_id], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = {
    getPrimarySkillsByStack
};
