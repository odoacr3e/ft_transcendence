
import * as lib from "../lib/lib.js";
export const authRouter = lib.include.express.Router();
import { createUser } from "../handlers/auth/register.js";
import { checkLogin } from "../handlers/auth/login.js";
import { refreshToken } from "../handlers/auth/refresh.js";

// route /auth
authRouter.post("/login", checkLogin);
authRouter.post("/register", createUser);
authRouter.post("/refresh", refreshToken);

