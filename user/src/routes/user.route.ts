import express from "express";
import {
  activateUser,
  getUserInfo,
  loginUser,
  logoutUser,
  registerUser,
  socialAuth,
  updateProfilePicture,
  updateUser,
} from "../controllers/user.controller";
import { isAuthenticated } from "@s7abab/common";

const router = express.Router();

router.post("/register", registerUser);

router.post("/activate-user", activateUser);

router.post("/login", loginUser);

router.get("/logout", logoutUser);

router.get("/current-user", isAuthenticated, getUserInfo);

router.post("/social-auth", socialAuth);

router.put("/update-user", isAuthenticated, updateUser)

router.put("/update-user-avatar", isAuthenticated, updateProfilePicture)

export default router;
