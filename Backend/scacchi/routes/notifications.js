
const lib = require("../lib/lib.js");
const router = lib.include.express.Router();

// NOTE: /api/notifications
router.get("/", () => {console.log("Notifications")});
router.get("/:id", () => {console.log("Notifications")});

module.exports = router;