
const lib = require("../lib/lib.js");
const router = lib.include.express.Router();
const { createUser } = require("../handlers/auth/register.js");
const { checkUser } = require("../handlers/auth/login.js");

// route /auth
router.post("/", checkUser);
router.post("/register", createUser);


module.exports = router;