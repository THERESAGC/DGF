const db = require('../config/db');

const getTrainingRequestDetails = (requestid) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                ntr.requestid,
                s.source_name AS source,
                tobj.training_name AS trainingobj,
                e1.name AS requestonbehalfof,
                ntr.requesttype,
                p.ProjectName AS project,
                ntr.expecteddeadline,
                ts.stack_name AS techstack,
                ntr.otherskill,
                ntr.suggestedcompletioncriteria,
                ntr.comments,
                ntr.numberofpeople,
                e2.name AS requestedby,
                ntr.createddate,
                ntr.modifiedby,
                ntr.modifieddate,
                ntr.requeststatus,
                ntr.approvedby,
                sd.service_name AS service_division,
                ntr.newprospectname,
                ntr.request_category,
                ntr.learningtype,
                ntr.skilldevelopment,
                e3.name AS assignedto
            FROM newtrainingrequest ntr
            LEFT JOIN logintable e1 ON ntr.requestonbehalfof = e1.emp_id
            LEFT JOIN logintable e2 ON ntr.requestedbyid = e2.emp_id
            LEFT JOIN logintable e3 ON ntr.AssignedTo = e3.emp_id
            LEFT JOIN training_obj tobj ON ntr.trainingobj = tobj.training_id
            LEFT JOIN source s ON ntr.source = s.source_id
            LEFT JOIN projectname p ON ntr.projectid = p.ProjectID
            LEFT JOIN techstack ts ON ntr.techstack = ts.stack_id
            LEFT JOIN service_division sd ON ntr.service_division = sd.id
            WHERE ntr.requestid = ?;
        `;

        db.execute(query, [requestid], (err, results) => {
            if (err) {
                return reject(err);
            }

            if (results.length === 0) {
                return resolve(null);
            }

            const requestDetails = results[0];

            const primarySkillsQuery = `
                SELECT ps.skill_name
                FROM Request_Primary_Skills rps
                JOIN primaryskill ps ON rps.primaryskill_id = ps.skill_id
                WHERE rps.requestid = ?;
            `;

            db.execute(primarySkillsQuery, [requestid], (err, skillsResults) => {
                if (err) {
                    return reject(err);
                }

                requestDetails.primarySkills = skillsResults.map(skill => skill.skill_name);
                resolve(requestDetails);
            });
        });
    });
};

module.exports = {
    getTrainingRequestDetails
};