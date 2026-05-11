
const lib = require("../lib/lib.js");
const router = lib.include.express.Router();
const { createUserHandler, loginUserHandler } = require("../handlers/auth.js");
const authUtils = require("../utils/auth.js");

const login = [ loginUserHandler.checkCredentials, loginUserHandler.checkUser ];
const register = [ createUserHandler.validateInput, createUserHandler.validateUser, createUserHandler.createUser ]


// route /auth
router.post("/", login);
router.post("/register", register);


module.exports = router;