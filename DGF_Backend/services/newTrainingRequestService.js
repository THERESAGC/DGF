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
    org_level // Add org_level parameter
}) => {
    // Log the received data
    console.log('Received data:', {
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
        requestedbyid,
        org_level
    });
 
    return new Promise((resolve, reject) => {
        // If projectid is null, set it to 999
        projectid = projectid ?? 0;
 
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
                requestedbyid,
                org_level
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
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
            requestedbyid ?? null,  // Add requestedbyid to params
            org_level ? 1 : 0  // Add org_level to params, default to 0 if null or false
        ];
 
        // Log the query and params
        console.log('Executing query:', query);
        console.log('With params:', params);
 
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
 
                // Log the notification query and params
                console.log('Executing notification query:', notificationQuery);
                console.log('With notification params:', notificationParams);
 
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
 