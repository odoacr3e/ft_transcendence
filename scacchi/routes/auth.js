
const lib = require("../lib/lib.js");
const router = lib.include.express.Router();
const { createUser } = require("../handlers/auth/register.js");
const { loginUserHandler } = require("../handlers/auth/login.js");

// TODO: da togliere checkCredentials come middleware e da inserire come funzione in checkUser
const login = [ loginUserHandler.checkCredentials, loginUserHandler.checkUser ];


// route /auth
router.post("/", login);
router.post("/register", createUser);


module.exports = router;