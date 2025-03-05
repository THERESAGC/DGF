// controllers/actionEmailController.js
const { sendEmail } = require("../services/mailService");

const handleAction = async (req, res) => {
    const requestBody = req.body; // Extract the request data
    console.log("Request body:", requestBody);
    const comment = requestBody.commentdata.comment_text;
    const requestername = requestBody.requestedby;
    // Destructure the necessary data from the request body
    const { action, requestid, requestedbyid, ccEmail } = requestBody;

    // Define subject and email content based on action
    let subject = "";
    let text = "";

    // switch (action) {
    //     case "approve":
    //         subject = "Training Request Approved";
    //         text = `Dear ${req},<br><br>
    //                 We are pleased to let you know that your request number <strong>LR ${requestid}</strong> has been approved. CAPDEV will initiate the program shortly.<br><br>
    //                 Thank you,<br>
    //                 Regards,<br>
    //                 CAPDEV`;
    //         break;
    
    //     case "reject":
    //         subject = "Training Request Rejected";
    //         text = `Dear ${req},<br><br>
    //                 We regret to inform you that your request number <strong>LR ${requestid}</strong> has been rejected.<br><br>
    //                 Rejection reason is as below: <br><br>
    //                 <strong>${comment}</strong><br><br>
    //                 Thank you.<br><br>
    //                 Warm Regards,<br>
    //                 CAPDEV`;
    //         break;
    
    //     case "hold":
    //         subject = "Training Request Suspended";
    //         text = `Dear ${req},<br><br>
    //                 We regret to inform you that your request number <strong>LR ${requestid}</strong> is temporarily on hold due to <strong>${comment}</strong>.<br>
    //                 Please get in touch with CAPDEV for any further information.<br><br>
    //                 Thank you,<br>
    //                 Regards,<br>
    //                 CAPDEV`;
    //         break;
    
    //     case "needClarification":
    //         subject = "Clarification Required for Training Request";
    //         text = `Dear ${req},<br><br>
    //                 Regarding your request number <strong>LR ${requestid}</strong>, the approver needs the following clarification:<br><br>
    //                 <strong>${comment}</strong><br><br>
    //                 Please log in to the system and record your response.<br><br>
    //                 Thank you,<br>
    //                 Regards,<br>
    //                 CAPDEV`;
    //         break;
    
    //     default:
    //         return res.status(400).json({ error: "Invalid action" });
    // }
    
    switch (action) {
        case "approve":
            subject = "Training Request Approved";
            text = `Dear ${requestername},<br><br>
                    We are pleased to let you know that your request number <strong>LR ${requestid}</strong> has been approved. CAPDEV will initiate the program shortly.<br><br>
                    Thank you,<br>
                    Regards,<br>
                    CAPDEV<br><br>
                    <img src="cid:signatureImage" alt="CAPDEV Logo" style="width: 100px; height: auto;" />`; // Email signature with image
            break;
    
        case "reject":
            subject = "Training Request Rejected";
            text = `Dear ${requestername},<br><br>
                    We regret to inform you that your request number <strong>LR ${requestid}</strong> has been rejected.<br><br>
                    Rejection reason is as below: <br><br>
                    <strong>${comment}</strong><br><br>
                    Thank you.<br><br>
                    Warm Regards,<br>
                    CAPDEV<br><br>
                    <img src="cid:signatureImage" alt="CAPDEV Logo" style="width: 100px; height: auto;" />`; // Email signature with image
            break;
    
        case "hold":
            subject = "Training Request Suspended";
            text = `Dear ${requestername},<br><br>
                    We regret to inform you that your request number <strong>LR ${requestid}</strong> is temporarily on hold due to <strong>${comment}</strong>.<br>
                    Please get in touch with CAPDEV for any further information.<br><br>
                    Thank you,<br>
                    Regards,<br>
                    CAPDEV<br><br>
                    <img src="cid:signatureImage" alt="CAPDEV Logo" style="width: 100px; height: auto;" />`; // Email signature with image
            break;
    
        case "needClarification":
            subject = "Clarification Required for Training Request";
            text = `Dear ${requestername},<br><br>
                    Regarding your request number <strong>LR ${requestid}</strong>, the approver needs the following clarification:<br><br>
                    <strong>${comment}</strong><br><br>
                    Please log in to the system and record your response.<br><br>
                    Thank you,<br>
                    Regards,<br>
                    CAPDEV<br><br>
                    <img src="cid:signatureImage" alt="CAPDEV Logo" style="width: 100px; height: auto;" />`; // Email signature with image
            break;
    
        default:
            return res.status(400).json({ error: "Invalid action" });
    }
    

    try {
        // 1. Send email to the person who made the request (requestedbyid)
        // await sendEmail(requestedbyid, subject, text, "champ@harbingergroup.com");
        // await sendEmail(requestedbyid, subject, text, ccEmail);

        // 2. Send email to the internal team (internalTeamEmail) as well
        // await sendEmail(internalTeamEmail, subject, `The training request (ID: ${requestid}) has been ${action}. Please review and process accordingly.`, ccEmail);

        res.status(200).json({ message: `Request has been ${action} and emails sent.` });
    } catch (error) {
        console.error("Error during email sending:", error);
        res.status(500).json({ error: "Error during email sending" });
    }
};

module.exports = { handleAction };
