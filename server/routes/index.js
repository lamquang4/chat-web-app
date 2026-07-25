const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth.routes"));
router.use("/users", require("./user.routes"));
router.use("/conversations", require("./conversation.routes"));
router.use("/messages", require("./message.routes"));

module.exports = router;
