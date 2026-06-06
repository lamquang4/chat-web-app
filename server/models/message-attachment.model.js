const mongoose = require("mongoose");

const messageAttachmentSchema = new mongoose.Schema({
  message_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
    required: true,
    index: true,
  },
  conversation_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ["image", "document", "audio"],
    required: true,
  },
  url: { type: String, required: true },
  file_name: { type: String, default: null },
  file_size: { type: Number, default: null },
  mime_type: { type: String, default: null },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("MessageAttachment", messageAttachmentSchema);
