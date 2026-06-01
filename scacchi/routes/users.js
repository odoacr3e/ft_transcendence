
import * as lib from "../lib/lib.js";
const router = lib.include.express.Router();
import { getUsersHandler, deleteUserHandler, updateUserHandler } from "../handlers/users.js";
import { checkJwt } from "../utils/auth.js";

// NOTE: route /api/users/
router.get("/", checkJwt, getUsersHandler.getAllUsers);
router.get("/:id", checkJwt, getUsersHandler.getUserById);

router.delete("/:id", deleteUserHandler.deleteUserById);

router.patch("/:id", updateUserHandler.updateUserById);

export default router; // esportato come funzione e non come oggetto
