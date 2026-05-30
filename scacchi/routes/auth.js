
import * as lib from "../lib/lib.js";
const router = lib.include.express.Router();
import { createUser } from "../handlers/auth/register.js";
import { checkLogin } from "../handlers/auth/login.js";
import { refreshToken } from "../handlers/auth/refresh.js";

// route /auth
router.post("/login", checkLogin);
router.post("/register", createUser);
router.post("/refresh", refreshToken);


export default router;
