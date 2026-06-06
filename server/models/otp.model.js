const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, index: true },
  otp_code_hash: { type: String, required: true },
  expires_at: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Otp", otpSchema);
