import { Router } from "express";
import { login, logout } from "../../controllers/v1/auth";
import getUserAfterLogin from "../../controllers/v1/auth/getUserAfterLogin.controller";
import { authenticate } from "../../middleware/auth.middleware";

const AuthRouter = Router();

AuthRouter.post("/login", login);
AuthRouter.post("/logout", logout);
AuthRouter.get("/me", authenticate, getUserAfterLogin);
export default AuthRouter;
