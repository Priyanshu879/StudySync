const { Resource } = require("../models/ResourceModel");
const { Session } = require("../models/SessionModel");

// Upload resource (file or link)
const uploadResource = async (req, res) => {
  try {
    const { type, content } = req.body;
    const sessionId = req.params.sessionId;

    // Validate session
    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    const isParticipant =
      session.participants.includes(req.user.id) ||
      session.host.toString() === req.user.id.toString();
    if (!isParticipant)
      return res.status(403).json({ message: "Access denied" });

    // Save resource
    const resource = new Resource({
      sessionId,
      uploader: req.user.id.toString(),
      type,
      url:content.url,
      name: content.name || "Resource",
    });
    await resource.save();

    res.status(201).json({ message: "Resource uploaded", resource });
  } catch (err) {
    console.error("Resource upload error:", err);
    res
      .status(500)
      .json({ message: "Failed to upload resource", error: err.message });
  }
};

// Get all resources of a session
const getResourcesBySession = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    const isParticipant =
      session.participants.includes(req.user.id.toString()) ||
      session.host.toString() === req.user.id.toString();
    if (!isParticipant)
      return res.status(403).json({ message: "Access denied" });

    const resources = await Resource.find({ sessionId }).populate(
      "uploader",
      "username email"
    );

    res.status(200).json({ resources });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to get resources", error: err.message });
  }
};

module.exports = {
  uploadResource,
  getResourcesBySession,
};
