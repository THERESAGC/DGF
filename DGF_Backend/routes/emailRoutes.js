// routes/emailRoutes.js
const express = require("express");
const { handleSubmit } = require("../controllers/emailController"); // Import the email controller
const router = express.Router();

// Define the POST route for submitting a training request and sending emails
router.post("/submitTrainingRequest", handleSubmit);

module.exports = router;

