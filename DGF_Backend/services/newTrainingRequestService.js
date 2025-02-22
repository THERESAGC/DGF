const db = require('../config/db');

const createNewRequest = ({
    requestid,
    requestonbehalfof,
    source,
    trainingobj,
    projectid,
    newprospectname,
    expecteddeadline,
    techstack,
    otherskill,
    suggestedcompletioncriteria,
    comments,
    servicedivision,
    requestedbyid, // Take requestedbyid from user input
}) => {
    return new Promise((resolve, reject) => {
        // If projectid is null, set it to 999
        projectid = projectid ?? 999;

        const query = `
            INSERT INTO newtrainingrequest (
                requestid,  
                requestonbehalfof,
                source,
                trainingobj,
                projectid,
                newprospectname,
                expecteddeadline,
                techstack,
                otherskill,
                suggestedcompletioncriteria,
                comments,
                service_division,
                requestedbyid 
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;

        const params = [
            requestid ?? null,  
            requestonbehalfof ?? null,
            source ?? null,
            trainingobj ?? null,
            projectid,  // projectid is now guaranteed to be set to 999 if null
            newprospectname ?? null,
            expecteddeadline ?? null,
            techstack ?? null,
            otherskill ?? null, 
            suggestedcompletioncriteria ?? null,
            comments ?? null,
            servicedivision ?? null,
            requestedbyid ?? null  // Add requestedbyid to params
        ];

        // Insert into newtrainingrequest first
        db.execute(query, params, (err, results) => {
            if (err) {
                reject(err); // Reject if there's an error in inserting newtrainingrequest
            } else {
                // If successful, now insert into notifications
                const notificationQuery = `
                    INSERT INTO notifications (emp_id, requestid, is_read)
                    SELECT emp_id, ?, FALSE FROM logintable;
                `;
                const notificationParams = [requestid]; // Only need requestid for this query

                db.execute(notificationQuery, notificationParams, (err, notificationResults) => {
                    if (err) {
                        reject(err); // Reject if there's an error in inserting into notifications
                    } else {
                        resolve({ newTrainingRequest: results, notification: notificationResults }); // Return both results
                    }
                });
            }
        });
    });
};

module.exports = {
    createNewRequest
};
