
const lib = require("../lib/lib.js");
const router = lib.include.express.Router();
const authHandler = require("../handlers/auth.js");
const authUtils = require("../utils/auth.js");

// /login
router.post("/", authHandler.checkCredentials, authHandler.checkUser, authUtils.createJwt);


module.exports = router;