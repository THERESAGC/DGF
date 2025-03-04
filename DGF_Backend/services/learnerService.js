const db = require('../config/db');

const getLearnersService = (emp_id) => {
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
                AND newtrainingrequest.org_level = 0
                AND emp_newtrainingrequested.emp_id = ?
            GROUP BY 
                emp_newtrainingrequested.emp_id, 
                emp_newtrainingrequested.requestid, 
                newtrainingrequest.requeststatus,
                emp_newtrainingrequested.createddate;
        `;

        const totalRequestsQuery = `
            SELECT COUNT(DISTINCT requestid) AS total_requests
            FROM emp_newtrainingrequested 
            WHERE emp_id = ? 
            AND requestid IN (
                SELECT requestid 
                FROM newtrainingrequest 
                WHERE requeststatus NOT IN ('rejected', 'completed', 'partially completed') 
                AND org_level = 0
            );
        `;

        const totalPrimarySkillsQuery = `
            SELECT COUNT(primaryskill_id) AS total_primary_skills
            FROM request_primary_skills 
            WHERE requestid IN (
                SELECT requestid 
                FROM emp_newtrainingrequested 
                WHERE emp_id = ? 
                AND requestid IN (
                    SELECT requestid 
                    FROM newtrainingrequest 
                    WHERE requeststatus NOT IN ('rejected', 'completed', 'partially completed') 
                    AND org_level = 0
                )
            );
        `;

        db.execute(totalRequestsQuery, [emp_id], (err, totalRequestsResults) => {
            if (err) {
                reject(err);
            } else {
                db.execute(totalPrimarySkillsQuery, [emp_id], (err, totalPrimarySkillsResults) => {
                    if (err) {
                        reject(err);
                    } else {
                        db.execute(query, [emp_id], (err, results) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve({
                                    total_requests: totalRequestsResults[0].total_requests,
                                    total_primary_skills: totalPrimarySkillsResults[0].total_primary_skills,
                                    requests: results
                                });
                            }
                        });
                    }
                });
            }
        });
    });
};

module.exports = {
    getLearnersService
};