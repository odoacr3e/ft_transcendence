
const lib = require("../lib/lib.js");
const router = lib.include.express.Router();

router.use("/users", require("./users.js"));
router.use("/game", require("./game.js"));
router.use("/pieces", require("./pieces.js"));
router.use("/notifications", require("./notifications.js"));

module.exports = router;
