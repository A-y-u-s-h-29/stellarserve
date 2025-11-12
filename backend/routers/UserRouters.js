import express from "express";
import {
  registerUser,
  loginUser,
  isAuth,
  logoutUser,
  forgotPassword,
  resetPassword
} from "../controllers/UserControllers.js";

const UserRouter = express.Router();

// ✅ Register new user → saves to MongoDB
UserRouter.post("/register", registerUser);

// ✅ Login existing user → validates & returns JWT
UserRouter.post("/login", loginUser);

// ✅ Get current authenticated user (used by fetchUser in frontend)
UserRouter.get("/me", isAuth);

// ✅ Logout user → clears cookie & token client-side
UserRouter.post("/logout", logoutUser);

// ✅ Forgot password → sends email with reset link
UserRouter.post("/forgot-password", forgotPassword);

// ✅ Reset password → validates token & updates password
UserRouter.post("/reset-password", resetPassword);

export default UserRouter;
