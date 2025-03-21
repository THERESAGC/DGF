const newTrainingRequestService = require('../services/newTrainingRequestService');

exports.createNewTrainingRequest = async (req, res) => {
    let {
        requestid, // Now included in the request body
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
        requestedbyid,
        org_level,
    } = req.body;

    // Ensure projectid is set to 0 if null or undefined
    projectid = projectid ?? 0;
    if(requestedbyid === requestonbehalfof)
        {
            requeststatus="Capdev Approval Requested"
        }else{
            requeststatus="Approval Requested"
        }
    // Validate if all required fields are present
    if (
        !requestid ||
        !requestonbehalfof ||
        !source ||
        !trainingobj ||
        projectid === null || projectid === undefined || // Explicitly check for null or undefined
        !servicedivision ||
        !requestedbyid
    ) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    try {
        // Call the service to create the training request, passing the serialized employeelevel
        const newRequest = await newTrainingRequestService.createNewRequest({
            requestid,
            requestonbehalfof,
            source,
            trainingobj,
            projectid,  // Passing projectid, now it should never be null
            newprospectname,
            numberofpeople,
            expecteddeadline,
            techstack,
            primaryskill,
            otherskill,
            suggestedcompletioncriteria,
            comments,
            servicedivision,
            requestedbyid,
            org_level,
            requeststatus  // Pass the requestedbyid here
        });

        res.status(201).json({ message: 'Training request created successfully', data: newRequest });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};