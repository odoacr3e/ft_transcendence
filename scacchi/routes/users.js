
const lib = require("../lib/lib.js");
const router = lib.include.express.Router();
const { getUsersHandler } = require("../handlers/users.js")


// NOTE: route /api/users/
router.get("/", getUsersHandler.getAllUsers);
router.get("/:id", getUsersHandler.getUserById);
// router.get("/username/:username", getUsersHandler.getUserByUsername); // forse non serve, per ora solo da test


module.exports = router; // esportato come funzione e non come oggetto
