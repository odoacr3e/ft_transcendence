
const lib = require("../lib/lib.js");
const router = lib.include.express.Router();
const authHandler = require("../handlers/auth.js");
const authUtils = require("../utils/auth.js");
const { getUsersHandler, createUserHandler } = require("../handlers/users.js")

const login = [ authHandler.checkCredentials, authHandler.checkUser ];
const register = [ createUserHandler.validateInput, createUserHandler.validateUser, createUserHandler.createUser ]


// route /auth
router.post("/", login);
router.post("/register", register);


module.exports = router;