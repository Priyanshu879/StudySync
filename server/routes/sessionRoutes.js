const express = require("express");
const router = express.Router();
const {
  createSession,
  getSessionById,
  addTimeSlots,
  voteSlot,
  confirmSlot
} = require("../controllers/sessionController");
const { verifyToken } = require("../middleware/authMiddleware");

// Create a new session
router.post("/", verifyToken, createSession);

// Get session by ID
router.get("/:id", verifyToken, getSessionById);

// Add proposed time slots (participants)
router.patch("/:id/slots", verifyToken, addTimeSlots);

// Vote for a time slot (participants)
router.post("/:id/vote", verifyToken, voteSlot);

// Confirm final slot (host only)
router.patch("/:id/confirm", verifyToken, confirmSlot);

module.exports = router;
