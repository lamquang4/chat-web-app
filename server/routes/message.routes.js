const express = require("express");
const router = express.Router();
const { validate } = require("../middleware/validate.middleware");
const {
  authMiddleware,
  requireAuth,
} = require("../middleware/auth.middleware");
const {
  uploadAttachments,
  validateAttachmentSize,
} = require("../middleware/upload.middleware");
const { sendMessageSchema } = require("../validate/message.validate");
const messageController = require("../controllers/message.controller");

router.use(authMiddleware, requireAuth);

router.post(
  "/:conversationId",
  uploadAttachments,
  validateAttachmentSize,
  validate(sendMessageSchema),
  messageController.sendMessage,
);

router.patch("/:messageId/recall", messageController.recallMessage);

module.exports = router;
