// routes/effectivenessFeedbackRoutes.js
const express = require("express");
const router = express.Router();
const { handleTaskCompletionRequest,getFeedbackDetails } = require("../controllers/effectivenessFeedbackController");

// Route to handle task completion
router.post("/task/:assignment_id/complete", handleTaskCompletionRequest);

// Route to fetch feedback details
router.get("/feedback/details", getFeedbackDetails);

module.exports = router;
