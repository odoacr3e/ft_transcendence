
const lib = require("../lib.js");
const router = lib.include.express.Router();
const authHandler = require("../handlers/auth.js")

router.post("/", authHandler.checkCredentials, authHandler.checkUser, authHandler.checkJwt);

module.exports = router;