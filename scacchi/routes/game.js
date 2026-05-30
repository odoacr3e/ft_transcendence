
import * as lib from "../lib/lib.js";
const router = lib.include.express.Router();
import {gameChecks, gameHandler, gameInfo} from "../handlers/game/Game.js";

router.get("/reload/", gameInfo);
router.get("/history/", gameInfo);
router.post("/", gameChecks, gameHandler);

export default router;