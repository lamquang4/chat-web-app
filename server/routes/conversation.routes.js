const express = require("express");
const router = express.Router();
const {
  authMiddleware,
  requireAuth,
} = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validate.middleware");
const {
  uploadImage,
  validateImageSize,
} = require("../middleware/upload.middleware");
const {
  createGroupSchema,
  updateGroupSchema,
} = require("../validate/conversation.validate");
const conversationController = require("../controllers/conversation.controller");

router.use(authMiddleware, requireAuth);

router.get("/", conversationController.getConversationList);
router.get("/:conversationId", conversationController.getConversationDetail);
router.get("/group/:conversationId", conversationController.getGroupMembers);

router.post(
  "/group",
  uploadImage,
  validateImageSize,
  conversationController.normalizeMemberIds,
  validate(createGroupSchema, "body"),
  conversationController.createGroup,
);

router.put(
  "/group/:conversationId",
  uploadImage,
  validateImageSize,
  conversationController.normalizeMemberIds,
  validate(updateGroupSchema, "body"),
  conversationController.updateGroup,
);

router.delete("/group/:conversationId", conversationController.deleteGroup);
router.post("/:conversationId/members", conversationController.addGroupMembers);
router.delete(
  "/:conversationId/members/:userId",
  conversationController.removeGroupMember,
);
router.patch(
  "/:conversationId/members/:userId/promote",
  conversationController.promoteToAdmin,
);
router.patch(
  "/:conversationId/members/:userId/demote",
  conversationController.demoteAdmin,
);
router.patch(
  "/:conversationId/members/:targetUserId/transfer-owner",
  conversationController.transferOwnership,
);
router.post(
  "/private/:targetUserId",
  authMiddleware,
  conversationController.getOrCreatePrivateConversation,
);

module.exports = router;
