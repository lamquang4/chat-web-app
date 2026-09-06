const config = require("./app.config");

const getEmailAddress = (sender) => {
  const match = sender.match(/<([^>]+)>/);
  return match ? match[1].trim() : sender.trim();
};

const sendEmail = async ({ to, subject, html }) => {
  try {
    const { apiKey, secretKey, from } = config.mailjet;

    if (!apiKey || !secretKey || !from) {
      console.error(
        "[MAILJET] Thiếu MAILJET_API_KEY, MAILJET_SECRET_KEY hoặc MAILJET_FROM",
      );
      return false;
    }

    const response = await fetch("https://api.mailjet.com/v3.1/send", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${apiKey}:${secretKey}`).toString(
          "base64",
        )}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Messages: [
          {
            From: {
              Email: getEmailAddress(from),
              Name: "Chat Web App",
            },
            To: [{ Email: to }],
            Subject: subject,
            HTMLPart: html,
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error(
        `[MAILJET] API ${response.status}: ${await response.text()}`,
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error("[MAILJET] Gửi email thất bại:", error.message);
    return false;
  }
};

module.exports = { sendEmail };
