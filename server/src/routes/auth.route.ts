import express from "express";
import {
  forgetPasswordHandler,
  loginHandler,
  logoutHandler,
  registerHandler,
  resetPasswordHandler,
} from "../controllers/auth.controller";
const authRoutes = express.Router();

authRoutes.post("/register", registerHandler);
authRoutes.post("/login", loginHandler);
authRoutes.get("/logout", logoutHandler);
authRoutes.post("/forget-password", forgetPasswordHandler);
authRoutes.post("/reset-password/:token", resetPasswordHandler);

export default authRoutes;
