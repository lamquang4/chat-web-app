const nodemailer = require("nodemailer");
const config = require("./app.config");

const transporter = nodemailer.createTransport({
  host: config.nodemailer.host,
  port: config.nodemailer.port,
  secure: config.nodemailer.secure,
  auth: {
    user: config.nodemailer.user,
    pass: config.nodemailer.password,
  },
});

transporter.verify((err) => {
  if (err) {
    console.error("[MAIL] Cấu hình SMTP lỗi:", err.message);
  } else {
    console.log("[MAIL] Sẵn sàng gửi email");
  }
});

module.exports = transporter;
