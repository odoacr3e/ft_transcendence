
const lib = require("../lib.js");
const router = lib.include.express.Router();
const authHandler = require("../handlers/auth.js")

router.post("/", authHandler.printBody);

module.exports = router;