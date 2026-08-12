const { validate } = require("../middleware/validate.middleware");
const express = require("express");
const router = express.Router();
const {
  authMiddleware,
  requireAuth,
} = require("../middleware/auth.middleware");
const {
  registerSchema,
  verifyRegisterOtpSchema,
  sendRegisterOtpSchema,
  loginSchema,
  refreshTokenSchema,
} = require("../validate/auth.validate");
const authController = require("../controllers/auth.controller");

router.post("/register", validate(registerSchema), authController.register);
router.post(
  "/register/otp/verify",
  validate(verifyRegisterOtpSchema),
  authController.verifyRegisterOtp,
);
router.post(
  "/register/otp/resend",
  validate(sendRegisterOtpSchema),
  authController.resendRegisterOtp,
);
router.post("/login", validate(loginSchema), authController.login);
router.post(
  "/refresh-token",
  validate(refreshTokenSchema),
  authController.refreshToken,
);
router.post("/logout", authMiddleware, requireAuth, authController.logout);

module.exports = router;
