import { Router } from "express";
import { login, logout } from "../../controllers/v1/auth";

const AuthRouter = Router();

AuthRouter.post("/login", login);
AuthRouter.post("/logout", logout);
export default AuthRouter;
