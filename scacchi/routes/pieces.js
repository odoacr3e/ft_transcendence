
const lib = require("../lib/lib.js");
const router = lib.include.express.Router();

// NOTE: /api/pieces
router.get("/", () => {console.log("Pieces")});
router.get("/:id", () => {console.log("Pieces id")});
