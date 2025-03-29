// // controllers/actionEmailController.js
// const { sendEmail } = require("../services/mailService");

// const handleAction = async (req, res) => {
//     const requestBody = req.body; // Extract the request data
//     console.log("Request body:", requestBody);
//     const comment = requestBody.commentdata.comment_text;
//     const requestername = requestBody.requestedby;
//     // Destructure the necessary data from the request body
//     const { action, requestid, requestedbyid, ccEmail } = requestBody;

//     // Define subject and email content based on action
//     let subject = "";
//     let text = "";

//     // switch (action) {
//     //     case "approve":
//     //         subject = "Training Request Approved";
//     //         text = `Dear ${req},<br><br>
//     //                 We are pleased to let you know that your request number <strong>LR ${requestid}</strong> has been approved. CAPDEV will initiate the program shortly.<br><br>
//     //                 Thank you,<br>
//     //                 Regards,<br>
//     //                 CAPDEV`;
//     //         break;
    
//     //     case "reject":
//     //         subject = "Training Request Rejected";
//     //         text = `Dear ${req},<br><br>
//     //                 We regret to inform you that your request number <strong>LR ${requestid}</strong> has been rejected.<br><br>
//     //                 Rejection reason is as below: <br><br>
//     //                 <strong>${comment}</strong><br><br>
//     //                 Thank you.<br><br>
//     //                 Warm Regards,<br>
//     //                 CAPDEV`;
//     //         break;
    
//     //     case "hold":
//     //         subject = "Training Request Suspended";
//     //         text = `Dear ${req},<br><br>
//     //                 We regret to inform you that your request number <strong>LR ${requestid}</strong> is temporarily on hold due to <strong>${comment}</strong>.<br>
//     //                 Please get in touch with CAPDEV for any further information.<br><br>
//     //                 Thank you,<br>
//     //                 Regards,<br>
//     //                 CAPDEV`;
//     //         break;
    
//     //     case "needClarification":
//     //         subject = "Clarification Required for Training Request";
//     //         text = `Dear ${req},<br><br>
//     //                 Regarding your request number <strong>LR ${requestid}</strong>, the approver needs the following clarification:<br><br>
//     //                 <strong>${comment}</strong><br><br>
//     //                 Please log in to the system and record your response.<br><br>
//     //                 Thank you,<br>
//     //                 Regards,<br>
//     //                 CAPDEV`;
//     //         break;
    
//     //     default:
//     //         return res.status(400).json({ error: "Invalid action" });
//     // }
    
//     switch (action) {
//         case "approve":
//             // subject = "Training Request Approved";
//             // text = `Dear ${requestername},<br><br>
//             //         We are pleased to let you know that your request number <strong>LR ${requestid}</strong> has been approved. CAPDEV will initiate the program shortly.<br><br>
//             //         Thank you,<br>
//             //         Regards,<br>
//             //         CAPDEV<br><br>
//             //         <img src="cid:signatureImage" alt="CAPDEV Logo" style="width: 100px; height: auto;" />`; // Email signature with image
//             // break;
//             subject = `Congratulations! Learning Request Approved `;

// text = `
//   <html>
//     <body>
//       <!-- Program Status Header Image -->
//       <img src="cid:programstatus-headerImage" alt="Program Status Header" style="width: 100%; height: auto;" />
//       <br><br>

//       <!-- Main Email Content -->
//       Dear ${requestername}, <br><br>

//       We hope this email finds you well. <br><br>

//       We are delighted to let you know that the Learning request ${requestid} submitted by you for the below team member/s has been approved by the SPOC. <br><br>

//       <strong>Name</strong> <br>
//       <strong>Current Project</strong> <br>
//       <strong>Delivery Unit</strong> <br>
//       <strong>Daily Learning Slot you have suggested</strong> <br><br>

//       <!-- Team Member Details -->
//      <!-- Dynamically generated list of team members -->

//       Your commitment to fostering the professional growth and skill enhancement of this team is truly commendable. The approved Learning will undoubtedly contribute to their development and, by extension, enhance the overall capabilities of the team. <br><br>

//       Please feel free to reach out if you need any further assistance in coordinating or if there are any additional steps required for a smooth implementation of the Learning. <br><br>

//       Once again, thank you for your dedication to the continuous improvement of our team members. We look forward to witnessing the positive impact of this Learning on individuals’ skills and contributions to our projects/organization. <br><br>

//       Best Regards, <br><br>

//       CapDev <br><br>

//       <!-- Signature Image -->
//       <img src="cid:signatureImage" alt="CAPDEV Logo" style="width: 100px; height: auto;" />

//       <br><br>
//       <!-- Footer Image -->
//       <img src="cid:footerImage" alt="Footer Image" style="width: 100%; height: auto;" />
//     </body>
//   </html>
// `;

    
//         case "reject":
//             // subject = "Training Request Rejected";
//             // text = `Dear ${requestername},<br><br>
//             //         We regret to inform you that your request number <strong>LR ${requestid}</strong> has been rejected.<br><br>
//             //         Rejection reason is as below: <br><br>
//             //         <strong>${comment}</strong><br><br>
//             //         Thank you.<br><br>
//             //         Warm Regards,<br>
//             //         CAPDEV<br><br>
//             //         <img src="cid:signatureImage" alt="CAPDEV Logo" style="width: 100px; height: auto;" />`; // Email signature with image
//             // break;
//             subject = `Learning request ${requestid} is rejected`;

// text = `
//   <html>
//     <body>
//       <!-- Program Status Header Image -->
//       <img src="cid:programstatus-headerImage" alt="Program Status Header" style="width: 100%; height: auto;" />
//       <br><br>

//       <!-- Main Email Content -->
//       Dear ${requestername}, <br><br>

//       We trust this email finds you well. <br><br>

//       We wanted to update you regarding the Learning request ${requestid} submitted by you. <br><br>

//       After careful consideration, the SPOC has, regretfully, decided to reject the request at this time. <br><br>

//       We understand that this decision may be disappointing, and want to assure you that we value and appreciate your commitment to the professional development of your team. <br><br>

//       Considering this, we encourage you to review the feedback provided by the SPOC. If there are any additional details or modifications that can be made to the Learning request to better align with the organization's goals, we would appreciate your input. <br><br>

//       ${comment} <br><br>  <!-- Comments will be inserted here as the rejection reason -->

//       We also welcome the opportunity to schedule a meeting to discuss this further and explore alternative Learning options that may better meet the organization's current requirements. <br><br>

//       Please let us know your availability for a meeting or if you would prefer to communicate via email. We are here to support you throughout this process, and we remain committed to facilitating the professional development of your team. <br><br>

//       Thank you for your understanding, and we look forward to working together to find a solution that meets both the team's needs and the organization's objectives. <br><br>

//       Best Regards, <br><br>

//       <!-- Signature Image -->
//       <img src="cid:signatureImage" alt="CAPDEV Logo" style="width: 100px; height: auto;" />
      
//       <br><br>
//       <!-- Footer Image -->
//       <img src="cid:footerImage" alt="Footer Image" style="width: 100%; height: auto;" />
//     </body>
//   </html>
// `;

    
//         case "hold":
//             // subject = "Training Request Suspended";
//             // text = `Dear ${requestername},<br><br>
//             //         We regret to inform you that your request number <strong>LR ${requestid}</strong> is temporarily on hold due to <strong>${comment}</strong>.<br>
//             //         Please get in touch with CAPDEV for any further information.<br><br>
//             //         Thank you,<br>
//             //         Regards,<br>
//             //         CAPDEV<br><br>
//             //         <img src="cid:signatureImage" alt="CAPDEV Logo" style="width: 100px; height: auto;" />`; // Email signature with image
//             // break;
//             subject = `Training Request Suspended`;

// text = `
//   <html>
//     <body>
//       <!-- Program Status Header Image -->
//       <img src="cid:programstatus-headerImage" alt="Program Status Header" style="width: 100%; height: auto;" />
//       <br><br>

//       <!-- Main Email Content -->
//       Dear ${requestername}, <br><br>

//       We regret to inform you that your request number <strong>LR ${requestid}</strong> is temporarily on hold due to <strong>${comment}</strong>. <br>
//       Please get in touch with CAPDEV for any further information. <br><br>

//       Thank you,<br>
//       Regards,<br>
//       CAPDEV<br><br>

//       <!-- Signature Image -->
//       <img src="cid:signatureImage" alt="CAPDEV Logo" style="width: 100px; height: auto;" />

//       <br><br>
//       <!-- Footer Image -->
//       <img src="cid:footerImage" alt="Footer Image" style="width: 100%; height: auto;" />
//     </body>
//   </html>
// `;

    
//         case "needClarification":
//             // subject = "Clarification Required for Training Request";
//             // text = `Dear ${requestername},<br><br>
//             //         Regarding your request number <strong>LR ${requestid}</strong>, the approver needs the following clarification:<br><br>
//             //         <strong>${comment}</strong><br><br>
//             //         Please log in to the system and record your response.<br><br>
//             //         Thank you,<br>
//             //         Regards,<br>
//             //         CAPDEV<br><br>
//             //         <img src="cid:signatureImage" alt="CAPDEV Logo" style="width: 100px; height: auto;" />`; // Email signature with image
//             // break;

//             subject = `Clarification Required for Training Request`;

// text = `
//   <html>
//     <body>
//       <!-- Program Status Header Image -->
//       <img src="cid:programstatus-headerImage" alt="Program Status Header" style="width: 100%; height: auto;" />
//       <br><br>

//       <!-- Main Email Content -->
//       Dear ${requestername}, <br><br>

//       Regarding your request number <strong>LR ${requestid}</strong>, the approver needs the following clarification: <br><br>

//       <strong>${comment}</strong><br><br>

//       Please log in to the system and record your response. <br><br>

//       Thank you,<br>
//       Regards,<br>
//       CAPDEV<br><br>

//       <!-- Signature Image -->
//       <img src="cid:signatureImage" alt="CAPDEV Logo" style="width: 100px; height: auto;" />

//       <br><br>
//       <!-- Footer Image -->
//       <img src="cid:footerImage" alt="Footer Image" style="width: 100%; height: auto;" />
//     </body>
//   </html>
// `;

    
//         default:
//             return res.status(400).json({ error: "Invalid action" });
//     }
    

//     try {
//         // 1. Send email to the person who made the request (requestedbyid)
//         await sendEmail(requestedbyid, subject, text, "champ@harbingergroup.com");
//         // await sendEmail(requestedbyid, subject, text, ccEmail);

//         // 2. Send email to the internal team (internalTeamEmail) as well
//         // await sendEmail(internalTeamEmail, subject, `The training request (ID: ${requestid}) has been ${action}. Please review and process accordingly.`, ccEmail);

//         res.status(200).json({ message: `Request has been ${action} and emails sent.` });
//     } catch (error) {
//         console.error("Error during email sending:", error);
//         res.status(500).json({ error: "Error during email sending" });
//     }
// };

// module.exports = { handleAction };
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

    switch (action) {
        case "approve":
            subject = `Congratulations! Learning Request Approved `;

            text = `
  <html>
    <body>
      <!-- Program Status Header Image -->
      <img src="cid:programstatus-headerImage" alt="Program Status Header" style="width: 100%; height: auto;" />
      <br><br>

      <!-- Main Email Content -->
      Dear ${requestername}, <br><br>

      We hope this email finds you well. <br><br>

      We are delighted to let you know that the Learning request ${requestid} submitted by you for the below team member/s has been approved by the SPOC. <br><br>

      <strong>Name</strong> <br>
      <strong>Current Project</strong> <br>
      <strong>Delivery Unit</strong> <br>
      <strong>Daily Learning Slot you have suggested</strong> <br><br>

      <!-- Team Member Details -->
     <!-- Dynamically generated list of team members -->

      Your commitment to fostering the professional growth and skill enhancement of this team is truly commendable. The approved Learning will undoubtedly contribute to their development and, by extension, enhance the overall capabilities of the team. <br><br>

      Please feel free to reach out if you need any further assistance in coordinating or if there are any additional steps required for a smooth implementation of the Learning. <br><br>

      Once again, thank you for your dedication to the continuous improvement of our team members. We look forward to witnessing the positive impact of this Learning on individuals’ skills and contributions to our projects/organization. <br><br>

      Best Regards, <br><br>

      CapDev <br><br>

      <!-- Signature Image -->
      <img src="cid:signatureImage" alt="CAPDEV Logo" style="width: 100px; height: auto;" />

      <br><br>
      <!-- Footer Image -->
      <img src="cid:footerImage" alt="Footer Image" style="width: 100%; height: auto;" />
    </body>
  </html>
`;

            break;

        case "reject":
            subject = `Learning request ${requestid} is rejected`;

            text = `
  <html>
    <body>
      <!-- Program Status Header Image -->
      <img src="cid:programstatus-headerImage" alt="Program Status Header" style="width: 100%; height: auto;" />
      <br><br>

      <!-- Main Email Content -->
      Dear ${requestername}, <br><br>

      We trust this email finds you well. <br><br>

      We wanted to update you regarding the Learning request ${requestid} submitted by you. <br><br>

      After careful consideration, the SPOC has, regretfully, decided to reject the request at this time. <br><br>

      We understand that this decision may be disappointing, and want to assure you that we value and appreciate your commitment to the professional development of your team. <br><br>

      Considering this, we encourage you to review the feedback provided by the SPOC. If there are any additional details or modifications that can be made to the Learning request to better align with the organization's goals, we would appreciate your input. <br><br>

      ${comment} <br><br>  <!-- Comments will be inserted here as the rejection reason -->

      We also welcome the opportunity to schedule a meeting to discuss this further and explore alternative Learning options that may better meet the organization's current requirements. <br><br>

      Please let us know your availability for a meeting or if you would prefer to communicate via email. We are here to support you throughout this process, and we remain committed to facilitating the professional development of your team. <br><br>

      Thank you for your understanding, and we look forward to working together to find a solution that meets both the team's needs and the organization's objectives. <br><br>

      Best Regards, <br><br>

      <!-- Signature Image -->
      <img src="cid:signatureImage" alt="CAPDEV Logo" style="width: 100px; height: auto;" />
      
      <br><br>
      <!-- Footer Image -->
      <img src="cid:footerImage" alt="Footer Image" style="width: 100%; height: auto;" />
    </body>
  </html>
`;

            break;

        case "hold":
            subject = `Training Request Suspended`;

            text = `
  <html>
    <body>
      <!-- Program Status Header Image -->
      <img src="cid:programstatus-headerImage" alt="Program Status Header" style="width: 100%; height: auto;" />
      <br><br>

      <!-- Main Email Content -->
      Dear ${requestername}, <br><br>

      We regret to inform you that your request number <strong>LR ${requestid}</strong> is temporarily on hold due to <strong>${comment}</strong>. <br>
      Please get in touch with CAPDEV for any further information. <br><br>

      Thank you,<br>
      Regards,<br>
      CAPDEV<br><br>

      <!-- Signature Image -->
      <img src="cid:signatureImage" alt="CAPDEV Logo" style="width: 100px; height: auto;" />

      <br><br>
      <!-- Footer Image -->
      <img src="cid:footerImage" alt="Footer Image" style="width: 100%; height: auto;" />
    </body>
  </html>
`;

            break;

        case "needClarification":
            subject = `Clarification Required for Training Request`;

            text = `
  <html>
    <body>
      <!-- Program Status Header Image -->
      <img src="cid:programstatus-headerImage" alt="Program Status Header" style="width: 100%; height: auto;" />
      <br><br>

      <!-- Main Email Content -->
      Dear ${requestername}, <br><br>

      Regarding your request number <strong>LR ${requestid}</strong>, the approver needs the following clarification: <br><br>

      <strong>${comment}</strong><br><br>

      Please log in to the system and record your response. <br><br>

      Thank you,<br>
      Regards,<br>
      CAPDEV<br><br>

      <!-- Signature Image -->
      <img src="cid:signatureImage" alt="CAPDEV Logo" style="width: 100px; height: auto;" />

      <br><br>
      <!-- Footer Image -->
      <img src="cid:footerImage" alt="Footer Image" style="width: 100%; height: auto;" />
    </body>
  </html>
`;

            break;

        default:
            return res.status(400).json({ error: "Invalid action" });
    }

    try {
        // 1. Send email to the person who made the request (requestedbyid)
        await sendEmail(requestedbyid, subject, text, "");

        res.status(200).json({ message: `Request has been ${action} and emails sent.` });
    } catch (error) {
        console.error("Error during email sending:", error);
        res.status(500).json({ error: "Error during email sending" });
    }
};

module.exports = { handleAction };
