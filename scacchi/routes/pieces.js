
const lib = require("../lib/lib.js");
const router = lib.include.express.Router();
const { getPiecesHandlers } = require("../handlers/pieces.js");

// NOTE: /api/pieces
router.get("/", getPiecesHandlers.getAllPieces);
router.get("/:id", getPiecesHandlers.getPieceById);

module.exports = router;