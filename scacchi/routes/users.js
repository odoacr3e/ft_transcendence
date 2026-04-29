
const lib = require("../lib.js");
const router = lib.include.express.Router();
const usersHandler = require("../handlers/users.js")

router.get("/", usersHandler.getAllUsers);
router.get("/:id", usersHandler.getUserById);
router.get("/username/:username", usersHandler.getUserByUsername); // forse non serve, per ora solo da test
router.post("/", usersHandler.createUser)

module.exports = router; // esportato come funzione e non come oggetto
