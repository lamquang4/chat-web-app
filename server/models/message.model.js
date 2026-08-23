const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversation_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    sender_id: {
      type: String,
      required: true,
    },
    content: { type: String, default: null, maxlength: 5000 },
    link_preview: {
      url: { type: String, default: null },
      title: { type: String, default: null },
      description: { type: String, default: null },
      image: { type: String, default: null },
      site_name: { type: String, default: null },
    },
    reply_msg_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    is_recalled: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

messageSchema.index({ conversation_id: 1, created_at: -1 });

module.exports = mongoose.model("Message", messageSchema);
