const db = require('../config/db');

// Function to get all training requests with names
const getAllTrainingRequests = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                ntr.requestid,
                ntr.source,
                s.source_name AS source_name,
                ntr.trainingobj,
                tobj.training_name AS trainingobj_name,
                ntr.requestonbehalfof,
                e1.name AS requestonbehalfof_name,
                ntr.requesttype,
                ntr.projectid,
                p.ProjectName AS project_name,
                ntr.expecteddeadline,
                ntr.techstack,
                ts.stack_name AS techstack_name,
                ntr.otherskill,
                ntr.suggestedcompletioncriteria,
                ntr.comments,
                ntr.numberofpeople,
                ntr.requestedby,
                ntr.requestedbyid,
                e2.name AS requestedbyid_name,
                ntr.createddate,
                ntr.modifiedby,
                ntr.modifieddate,
                ntr.requeststatus,
                ntr.approvedby,
                ntr.service_division,
                sd.service_name AS service_division_name,
                ntr.newprospectname,
                ntr.request_category,
                ntr.learningtype,
                ntr.skilldevelopment,
                ntr.AssignedTo,
                e3.name AS assignedto_name
            FROM newtrainingrequest ntr
            LEFT JOIN logintable e1 ON ntr.requestonbehalfof = e1.emp_id
            LEFT JOIN logintable e2 ON ntr.requestedbyid = e2.emp_id
            LEFT JOIN logintable e3 ON ntr.AssignedTo = e3.emp_id
            LEFT JOIN training_obj tobj ON ntr.trainingobj = tobj.training_id
            LEFT JOIN source s ON ntr.source = s.source_id
            LEFT JOIN projectname p ON ntr.projectid = p.ProjectID
            LEFT JOIN techstack ts ON ntr.techstack = ts.stack_id
            LEFT JOIN service_division sd ON ntr.service_division = sd.id;
        `;
        
        db.query(query, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = {
    getAllTrainingRequests
};