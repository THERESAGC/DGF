const { handleTaskCompletion, getEmployeeName, getCourseName, getRequestedByUsingReqId } = require("../services/effectivenessFeedbackService");

const handleTaskCompletionRequest = async (req, res) => {
  const { assignment_id } = req.params; // Assuming the assignment_id is passed as a URL parameter
  try {
    await handleTaskCompletion(assignment_id);
    res.status(200).send({ message: "Emails sent successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error handling task completion", error });
  }
};

// Controller to fetch feedback details
// const getFeedbackDetails = async (req, res) => {
//   const { course_id, employee_id, assignment_id } = req.query;

//   try {
//     // Fetch the required details using the service layer
//     const username = await getEmployeeName(employee_id);
//     const course_name = await getCourseName(course_id);
//     const requested_by = await getRequestedBy(assignment_id);

//     // Respond with the fetched details
//     res.status(200).json({ username, course_name, requested_by });
//   } catch (error) {
//     console.error("Error fetching feedback details:", error);
//     res.status(500).json({ error: "Failed to fetch feedback details" });
//   }
// };

// Controller to fetch feedback details
const getFeedbackDetails = async (req, res) => {
  const { course_id, employee_id, reqid } = req.query;

  if (!reqid || !course_id || !employee_id) {
    return res.status(400).json({ error: "reqid, course_id, and employee_id are required" });
  }

  try {
    // Fetch the required details using the service layer
    const username = await getEmployeeName(employee_id);
    const course_name = await getCourseName(course_id);
    const requested_by = await getRequestedByUsingReqId(reqid);

    // Respond with the fetched details
    res.status(200).json({ username, course_name, requested_by });
  } catch (error) {
    console.error("Error fetching feedback details:", error);
    res.status(500).json({ error: "Failed to fetch feedback details" });
  }
};

module.exports = { handleTaskCompletionRequest, getFeedbackDetails };