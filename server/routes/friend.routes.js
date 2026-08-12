const express = require("express");
const router = express.Router();
const {
  authMiddleware,
  requireAuth,
} = require("../middleware/auth.middleware");
const friendController = require("../controllers/friend.controller");

router.use(authMiddleware, requireAuth);

router.get("/", friendController.getFriendList);
router.get("/requests", friendController.getFriendRequestList);
router.get("/suggestions", friendController.getSuggestedFriends);

router.post("/request/:id", friendController.sendFriendRequest);
router.put("/request/:id", friendController.acceptFriendRequest);
router.delete("/request/:id", friendController.rejectFriendRequest);

router.delete("/:id", friendController.removeFriend);

module.exports = router;
