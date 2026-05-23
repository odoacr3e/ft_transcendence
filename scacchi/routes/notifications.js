
const lib = require("../lib/lib.js");
const router = lib.include.express.Router();
const handlersNotify = require("../handlers/notifications.js");


// NOTE: /api/notifications
router.get("/", handlersNotify.getNotifications);
router.get("/:id", handlersNotify.getNotificationById);

// router.get("/user/:id")

module.exports = router;