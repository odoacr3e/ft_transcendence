
const lib = require("../lib.js");
const router = lib.include.express.Router();
const {gameChecks, gameHandler} = require("../handlers/game/Game.js");

router.post("/", gameChecks, gameHandler);

module.exports = router;