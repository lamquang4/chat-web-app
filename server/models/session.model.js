const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  refresh_token_hash: { type: String, required: true, unique: true },
  user_agent: { type: String, default: null },
  ip_address: { type: String, default: null },
  is_revoked: { type: Boolean, default: false, index: true },
  expires_at: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 },
  },
  last_active_at: { type: Date, default: Date.now },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Session", sessionSchema);
