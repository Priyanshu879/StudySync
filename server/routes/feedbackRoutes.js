const express = require("express");
const router = express.Router();
const {
  submitFeedback,
  getFeedbackForSession,
} = require("../controllers/feedbackController");
const { verifyToken } = require("../middleware/authMiddleware");

// Submit feedback for a session
router.post("/:sessionId", verifyToken, submitFeedback);

// Get all feedback for a session
router.get("/:sessionId", verifyToken, getFeedbackForSession);

module.exports = router;
