
const lib = require("../lib/lib.js");
const router = lib.include.express.Router();
const { getUsersHandler, createUserHandler } = require("../handlers/users.js")

const mwCreateUser = [ createUserHandler.validateInput, createUserHandler.validateUser, createUserHandler.createUser ]

// /api/users/
router.get("/", getUsersHandler.getAllUsers);
router.get("/:id", getUsersHandler.getUserById);
router.post("/", mwCreateUser);

module.exports = router; // esportato come funzione e non come oggetto
