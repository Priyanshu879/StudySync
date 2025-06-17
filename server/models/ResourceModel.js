const mongoose = require("mongoose");

const ResourceSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Session",
    required: true,
  },
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["file", "link"],
    required: true,
  },
  url: {
    type: String,
    required: [true, "Resource URL is required"],
  },
  name: {
    type: String,
    required: [true, "Resource name is required"],
  },
}, { timestamps: true });

const Resource = mongoose.model("Resource", ResourceSchema);

module.exports = { Resource };
