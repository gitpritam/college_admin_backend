import { Router } from "express";
import {
  forgotPasswordController,
  login,
  logout,
  resetPasswordController,
  updatePasswordController,
} from "../../controllers/v1/auth";
import getUserAfterLogin from "../../controllers/v1/auth/getUserAfterLogin.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { validateRequest } from "../../middleware/validate.middleware";
import { forgotPasswordValidationSchema } from "../../validation/forgotPassword.validation";
import { resetPasswordValidationSchema } from "../../validation/resetPassword.validation";

const AuthRouter = Router();

AuthRouter.post("/login", login);
AuthRouter.post("/logout", logout);
AuthRouter.post(
  "/forgot-password",
  validateRequest(forgotPasswordValidationSchema),
  forgotPasswordController,
);
AuthRouter.post(
  "/reset-password",
  validateRequest(resetPasswordValidationSchema),
  resetPasswordController,
);
AuthRouter.get("/me", authenticate, getUserAfterLogin);
AuthRouter.patch("/update-password", authenticate, updatePasswordController);
export default AuthRouter;
