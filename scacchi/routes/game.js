
import * as lib from "../lib/lib.js";
import {gameChecks, gameHttpHandler, gameInfo} from "../handlers/game/Game.js";
export const gameRouter = lib.include.express.Router();

gameRouter.get("/reload/", gameInfo);
gameRouter.get("/history/", gameInfo);
gameRouter.post("/", gameChecks, gameHttpHandler);
