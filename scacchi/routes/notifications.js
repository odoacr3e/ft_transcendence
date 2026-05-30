
import * as lib from "../lib/lib.js";
const router = lib.include.express.Router();
import * as handlersNotify from "../handlers/notifications.js";


// NOTE: /api/notifications
router.get("/", handlersNotify.getNotifications);
router.get("/:id", handlersNotify.getNotificationById);

// router.get("/user/:id")

export default router;