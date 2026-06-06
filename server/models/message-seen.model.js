const mongoose = require("mongoose");

const messageSeenSchema = new mongoose.Schema({
  message_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
    required: true,
    index: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  seen_at: { type: Date, default: Date.now },
});

messageSeenSchema.index({ message_id: 1, user_id: 1 }, { unique: true });

module.exports = mongoose.model("MessageSeen", messageSeenSchema);
