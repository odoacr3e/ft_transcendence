
import * as lib from "../lib/lib.js";
import {gameChecks, gameHttpHandler} from "../handlers/game/Game.js";
export const gameRouter = lib.include.express.Router();

gameRouter.post("/", gameChecks, gameHttpHandler);
