const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
      trim: true,
      minlength: [1, "Họ không để trống"],
      maxlength: [50, "Họ tối đa 50 ký tự"],
    },
    last_name: {
      type: String,
      required: true,
      trim: true,
      minlength: [1, "Tên không để trống"],
      maxlength: [50, "Tên tối đa 50 ký tự"],
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      minlength: [5, "Email không hợp lệ"],
      maxlength: [255, "Email tối đa 255 ký tự"],
      match: [/^\S+@\S+\.\S+$/, "Email không hợp lệ"],
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      match: [
        /^(03[2-9]|05[689]|07[06-9]|08[0-689]|09[0-46-9])[0-9]{7}$/,
        "Số điện thoại không hợp lệ",
      ],
    },
    password_hash: {
      type: String,
      required: true,
      minlength: [6, "Mật khẩu tối thiểu 6 ký tự"],
    },
    avatar_url: { type: String, default: null },
    status: { type: String, enum: ["online", "offline"], default: "offline" },
    last_seen_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

module.exports = mongoose.model("User", userSchema);
