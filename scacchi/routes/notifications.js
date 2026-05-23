
const lib = require("../lib/lib.js");
const router = lib.include.express.Router();
const { getAllNotifications } = require("../handlers/notifications.js");


// NOTE: /api/notifications
router.get("/", getAllNotifications);
router.get("/:id", () => {console.log("Notifications")});

// router.get("/user/:id")

module.exports = router;