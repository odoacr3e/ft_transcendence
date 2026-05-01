
const lib = require("../lib.js");
const router = lib.include.express.Router();
const { getUsersHandler, createUserHandler } = require("../handlers/users.js")

// /api/users/
router.get("/", getUsersHandler.getAllUsers);
router.get("/:id", getUsersHandler.getUserById);
router.get("/username/:username", getUsersHandler.getUserByUsername); // forse non serve, per ora solo da test
router.post("/", createUserHandler.validateInput, createUserHandler.validateUser, createUserHandler.createUser);

module.exports = router; // esportato come funzione e non come oggetto
