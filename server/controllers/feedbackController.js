const { Feedback } = require("../models/FeedbackModel");
const { Session } = require("../models/SessionModel");

// Submit feedback after a session
const submitFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const sessionId = req.params.sessionId;

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    const isParticipant =
      session.host.toString() === req.user.id.toString() ||
      session.participants.includes(req.user.id.toString());
    if (!isParticipant)
      return res
        .status(403)
        .json({ message: "You are not part of this session" });

    const existing = await Feedback.findOne({
      sessionId: sessionId,
      userId: req.user.id.toString(),
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: "You already submitted feedback for this session" });
    }

    const feedback = new Feedback({
      sessionId: sessionId,
      userId: req.user.id.toString(),
      rating,
      comment,
    });

    await feedback.save();

    res.status(201).json({ message: "Feedback submitted", feedback });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to submit feedback", error: err.message });
  }
};

// Get all feedback for a session
const getFeedbackForSession = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    const isParticipant =
      session.host.toString() === req.user.id.toString() ||
      session.participants.includes(req.user.id.toString());
    if (!isParticipant)
      return res.status(403).json({ message: "Access denied" });

    const feedbacks = await Feedback.find({ sessionId: sessionId })
      .populate("userId", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json({ feedbacks });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch feedback", error: err.message });
  }
};

module.exports = {
  submitFeedback,
  getFeedbackForSession,
};
