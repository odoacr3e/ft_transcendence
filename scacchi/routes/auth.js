
const lib = require("../lib/lib.js");
const router = lib.include.express.Router();
const { createUser } = require("../handlers/auth/register.js");
const { checkLogin } = require("../handlers/auth/login.js");

// route /auth
router.post("/", checkLogin);
router.post("/register", createUser);


module.exports = router;