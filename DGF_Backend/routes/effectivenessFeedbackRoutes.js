// routes/effectivenessFeedbackRoutes.js
const express = require("express");
const router = express.Router();
const { handleTaskCompletionRequest } = require("../controllers/effectivenessFeedbackController");

// Route to handle task completion
router.post("/task/:assignment_id/complete", handleTaskCompletionRequest);

module.exports = router;
