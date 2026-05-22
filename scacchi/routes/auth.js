
const lib = require("../lib/lib.js");
const router = lib.include.express.Router();
const { createUser } = require("../handlers/auth/register.js");
const { checkLogin } = require("../handlers/auth/login.js");
const { refreshToken } = require("../handlers/auth/refresh.js");

// route /auth
router.post("/", checkLogin);
router.post("/login", checkLogin);
router.post("/register", createUser);
router.post("/refresh", refreshToken);


module.exports = router;
