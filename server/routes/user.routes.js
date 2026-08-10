// routes/user.route.js
const express = require("express");
const router = express.Router();
const { validate } = require("../middleware/validate.middleware");
const {
  requireAuth,
  authMiddleware,
} = require("../middleware/auth.middleware");
const {
  uploadImage,
  validateImageSize,
} = require("../middleware/upload.middleware");
const { updateUserSchema } = require("../validate/user.validate");
const userController = require("../controllers/user.controller");

router.get("/me", authMiddleware, requireAuth, userController.getAccount);

router.put(
  "/me",
  authMiddleware,
  requireAuth,
  uploadImage, 
  validateImageSize, 
  validate(updateUserSchema), 
  userController.updateUser, 
);

module.exports = router;
