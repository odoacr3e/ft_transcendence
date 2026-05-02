
const lib = require("../lib/lib.js");
const router = lib.include.express.Router();
const authHandler = require("../handlers/auth.js")

router.post("/", authHandler.checkCredentials, authHandler.checkUser);


module.exports = router;