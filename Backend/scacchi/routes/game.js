
const lib = require("../lib/lib.js");
const router = lib.include.express.Router();
const {gameChecks, gameHandler, gameInfo} = require("../handlers/game/Game.js");

router.get("/", gameInfo);
router.post("/", gameChecks, gameHandler);

module.exports = router;