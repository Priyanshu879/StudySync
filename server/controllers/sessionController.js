const { Session } = require("../models/SessionModel");
const { User } = require("../models/UserModel");

// Create a new session
const createSession = async (req, res) => {
  try {
    const { title, description, participants } = req.body;

    let participantsid = [];
    if (participants && participants.length > 0) {
      // Validate participants
      const users = await User.find({ username: { $in: participants } });
      if (users.length !== participants.length) {
        return res.status(400).json({
          message: "Some participants do not exist",
        });
      }
      participantsid = users.map((user) => user._id);
    }

    const newSession = new Session({
      title,
      description,
      host: req.user.id,
      participants: participantsid,
    });

    await newSession.save();

    res.status(201).json({ message: "Session created", session: newSession });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create session", error: err.message });
  }
};

// Get session by ID
const getSessionById = async (req, res) => {
  try {
    
    const session = await Session.findById(req.params.id)
      .populate("host", "username email")
      .populate("participants", "username email")
      .lean();

    
    

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Check if user is allowed to see the session
    const isAllowed = [
      session.host._id.toString(),
      ...session.participants.map((p) => p._id.toString()),
    ].includes(req.user.id.toString());
    if (!isAllowed) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json({ session });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch session", error: err.message });
  }
};

// Add proposed time slots
const addTimeSlots = async (req, res) => {
  try {
    const { slots } = req.body; // expected format: [{ time: Date }, { time: Date }]
    const session = await Session.findById(req.params.id);

    if (!session) return res.status(404).json({ message: "Session not found" });

    // Check if user is a participant
    const isParticipant =
      session.participants.includes(req.user.id) ||
      session.host.toString() === req.user.id.toString();
    if (!isParticipant)
      return res
        .status(403)
        .json({ message: "Only participants can propose slots" });

    // Add slots (avoid duplicates)
    slots.forEach(({ time }) => {
      const exists = session.proposedSlots.find(
        (slot) => new Date(slot.time).getTime() === new Date(time).getTime()
      );
      if (!exists) {
        session.proposedSlots.push({ time, votes: [] });
      }
    });

    await session.save();

    res.status(200).json({ message: "Slots added", session });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to add slots", error: err.message });
  }
};

// Vote on a proposed time slot
const voteSlot = async (req, res) => {
  try {
    const { slotTime } = req.body; // slotTime is a string ISO date
    const session = await Session.findById(req.params.id);

    if (!session) return res.status(404).json({ message: "Session not found" });

    // Check if user is a participant
    const isParticipant =
      session.participants.includes(req.user.id.toString()) ||
      session.host.toString() === req.user.id.toString();
    if (!isParticipant)
      return res.status(403).json({ message: "Only participants can vote" });

    const slot = session.proposedSlots.find(
      (s) => new Date(s.time).getTime() === new Date(slotTime).getTime()
    );

    if (!slot) return res.status(404).json({ message: "Slot not found" });

    // Avoid double voting
    const alreadyVoted = slot.votes.includes(req.user.id.toString());
    if (alreadyVoted)
      return res.status(400).json({ message: "Already voted on this slot" });

    slot.votes.push(req.user.id.toString());

    await session.save();

    res.status(200).json({ message: "Vote recorded", slot });
  } catch (err) {
    res.status(500).json({ message: "Failed to vote", error: err.message });
  }
};

// Confirm slot (host only)
const confirmSlot = async (req, res) => {
  try {
    const { confirmedTime } = req.body;
    const session = await Session.findById(req.params.id);

    if (!session) return res.status(404).json({ message: "Session not found" });
    if (session.host.toString() !== req.user.id.toString())
      return res
        .status(403)
        .json({ message: "Only host can confirm the slot" });

    session.confirmedSlot = confirmedTime;
    await session.save();

    res
      .status(200)
      .json({ message: "Slot confirmed", confirmedSlot: confirmedTime });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to confirm slot", error: err.message });
  }
};

module.exports = {
  createSession,
  getSessionById,
  addTimeSlots,
  voteSlot,
  confirmSlot,
};
