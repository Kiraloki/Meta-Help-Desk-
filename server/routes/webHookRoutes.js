const express = require("express");
const { webhookCallback, webhookVerify } = require("../controllers/webHookController");

const router = express.Router();

router.post("//messaging-webhook",webhookCallback);
router.get("/messaging-webhook", webhookVerify);

module.exports = router;
