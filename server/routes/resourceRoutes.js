const express = require("express");
const router = express.Router();
const {
  uploadResource,
  getResourcesBySession,
} = require("../controllers/resourceController");
const { verifyToken } = require("../middleware/authMiddleware");

// Upload a resource (file or link) to a session
router.post("/:sessionId", verifyToken, uploadResource);

// Get all resources for a session
router.get("/:sessionId", verifyToken, getResourcesBySession);

module.exports = router;
