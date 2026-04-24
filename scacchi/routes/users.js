
const lib = require("../lib.js");
const router = lib.include.express.Router();
const usersHandler = require("../handlers/users.js")

router.get("/", usersHandler.getAllUsers);
router.get("/:id", usersHandler.getUserById);
router.get("/username/:username", usersHandler.getUserByUsername);

module.exports = router; // esportato come funzione e non come oggetto
