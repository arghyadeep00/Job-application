import express from "express";
import {
  register,
  login,
  logout,
  authMe,
} from "../controllers/authController.js";
import uploadResume from "../middleware/resumeUploadMiddleware.js";
import { verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/register", uploadResume.single("resume"), register);
router.get("/me", verifyToken, authMe);
router.post("/login", login);
router.post("/logout", logout);

export default router;
