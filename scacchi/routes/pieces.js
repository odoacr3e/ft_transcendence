
import * as lib from "../lib/lib.js";
const router = lib.include.express.Router();
import { getPiecesHandlers } from "../handlers/pieces.js";

// NOTE: /api/pieces
router.get("/", getPiecesHandlers.getAllPieces);
router.get("/:id", getPiecesHandlers.getPieceById);

export default router;