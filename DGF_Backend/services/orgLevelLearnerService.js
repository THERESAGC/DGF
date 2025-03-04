const db = require('../config/db');

const getOrgLevelLearnerDataService = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                emp_newtrainingrequested.emp_id, 
                emp_newtrainingrequested.requestid, 
                newtrainingrequest.requeststatus AS status, 
                emp_newtrainingrequested.createddate,
                COUNT(request_primary_skills.primaryskill_id) AS primary_skills_count,
                GROUP_CONCAT(DISTINCT primaryskill.skill_name) AS primary_skills,
                GROUP_CONCAT(DISTINCT techstack.stack_name) AS tech_stacks
            FROM 
                emp_newtrainingrequested
            LEFT JOIN 
                request_primary_skills 
            ON 
                emp_newtrainingrequested.requestid = request_primary_skills.requestid
            LEFT JOIN
                newtrainingrequest
            ON
                emp_newtrainingrequested.requestid = newtrainingrequest.requestid
            LEFT JOIN
                primaryskill
            ON
                request_primary_skills.primaryskill_id = primaryskill.skill_id
            LEFT JOIN
                techstack
            ON
                primaryskill.stack_id = techstack.stack_id
            WHERE 
                newtrainingrequest.requeststatus NOT IN ('rejected', 'completed', 'partially completed')
                AND newtrainingrequest.org_level = 1
            GROUP BY 
                emp_newtrainingrequested.emp_id, 
                emp_newtrainingrequested.requestid, 
                newtrainingrequest.requeststatus,
                emp_newtrainingrequested.createddate;
        `;

        db.execute(query, [], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = {
    getOrgLevelLearnerDataService
};