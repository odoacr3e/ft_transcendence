
const lib = require("../lib.js");
const router = lib.include.express.Router();
const {gameHandler} = require("../handlers/game/Game.js");

router.post("/", gameHandler);

module.exports = router;