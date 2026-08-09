const express = require("express");
const router = express.Router();

const v1Router = express.Router();
v1Router.use("/auth", require("./auth.routes"));
/*
v1Router.use("/users", require("./user.routes"));
v1Router.use("/conversations", require("./conversation.routes"));
v1Router.use("/messages", require("./message.routes"));
*/
router.use("/v1", v1Router);

module.exports = router;
