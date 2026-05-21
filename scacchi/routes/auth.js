
const lib = require("../lib/lib.js");
const router = lib.include.express.Router();
const { createUser } = require("../handlers/auth/register.js");
const { checkLogin } = require("../handlers/auth/login.js");
const { refresh } = require("../handlers/auth/refresh.js");

// route /auth
router.post("/", checkLogin);
router.post("/register", createUser);
router.post("/refresh", refresh);


module.exports = router;