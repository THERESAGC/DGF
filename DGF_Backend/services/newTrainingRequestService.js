// services/newTrainingRequestService.js
const db = require('../config/db');

const createNewRequest = ({
    requestid,
    requestonbehalfof,
    source,
    trainingobj,
    projectid,
    newprospectname,
    numberofpeople,
    expecteddeadline,
    techstack,
    primaryskill,
    otherskill,
    suggestedcompletioncriteria,
    comments,
    servicedivision,
    requestedbyid, // Take requestedbyid from user input
}) => {
    return new Promise((resolve, reject) => {
        // If projectid is null, set it to 999

        const query = `
            INSERT INTO newtrainingrequest (
                requestid,  
                requestonbehalfof,
                source,
                trainingobj,
                projectid,
                newprospectname,
                numberofpeople,
                expecteddeadline,
                techstack,
                primaryskill,
                otherskill,
                suggestedcompletioncriteria,
                comments,
                service_division,
                requestedbyid 
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;

        const params = [
            requestid ?? null,  
            requestonbehalfof ?? null,
            source ?? null,
            trainingobj ?? null,
            projectid,  // projectid is now guaranteed to be set to 999 if null
            newprospectname ?? null,
            numberofpeople ?? null,
            expecteddeadline ?? null,
            techstack ?? null,
            primaryskill ?? null,
            otherskill ?? null, 
            suggestedcompletioncriteria ?? null,
            comments ?? null,
            servicedivision ?? null,
            requestedbyid ?? null  // Add requestedbyid to params
        ];

        db.execute(query, params, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results); // Return the result of the insert
            }
        });
    });
};

module.exports = {
    createNewRequest
};