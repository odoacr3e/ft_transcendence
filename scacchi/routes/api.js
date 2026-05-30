
import * as lib from "../lib/lib.js";
import usersRouter from "./users.js";
import gameRouter from "./game.js";
import piecesRouter from "./pieces.js";
import notificationsRouter from "./notifications.js";
const router = lib.include.express.Router();

router.use("/users", usersRouter);
router.use("/game", gameRouter);
router.use("/pieces", piecesRouter);
router.use("/notifications", notificationsRouter);

export default router;
