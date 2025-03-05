// routes/emailRoutes.js
const express = require("express");
const { handleSubmit } = require("../controllers/emailController"); // Import the existing submit function
const { handleAction } = require("../controllers/actionEmailController"); // Import the new action handler
const router = express.Router();

// Route for submitting a training request
router.post("/submitTrainingRequest", handleSubmit);

// Route for approving, rejecting, suspending, or clarifying a training request
router.post("/approveRejectSuspendClarify", handleAction);

module.exports = router;
