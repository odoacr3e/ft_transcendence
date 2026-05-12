
const lib = require("../lib/lib.js");
const router = lib.include.express.Router();
const { createUserHandler } = require("../handlers/auth/register.js");
const { loginUserHandler } = require("../handlers/auth/login.js");

const login = [ loginUserHandler.checkCredentials, loginUserHandler.checkUser ];
const register = [ createUserHandler.validateInput, createUserHandler.validateUser, createUserHandler.createUser ]


// route /auth
router.post("/", login);
router.post("/register", register);


module.exports = router;