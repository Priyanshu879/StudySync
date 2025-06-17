const mongoose = require("mongoose");

const SlotSchema = new mongoose.Schema({
  time: {
    type: Date,
    required: true,
  },
  votes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  ]
}, { _id: false });

const SessionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Session title is required"],
  },
  description: {
    type: String,
    default: "",
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  ],
  proposedSlots: [SlotSchema],
  confirmedSlot: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

const Session = mongoose.model("Session", SessionSchema);

module.exports = { Session };
