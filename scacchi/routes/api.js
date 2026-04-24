
const lib = require("../lib.js");
const router = lib.include.express.Router();

router.use("/users", require("./users.js"));

module.exports = router;
