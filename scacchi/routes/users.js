
const lib = require("../lib/lib.js");
const router = lib.include.express.Router();
const { getUsersHandler, deleteUserHandler, updateUserHandler } = require("../handlers/users.js")


// NOTE: route /api/users/
router.get("/", getUsersHandler.getAllUsers);
router.get("/:id", getUsersHandler.getUserById);

router.delete("/:id", deleteUserHandler.deleteUserById);

router.patch("/:id", updateUserHandler.updateUserById);


module.exports = router; // esportato come funzione e non come oggetto
