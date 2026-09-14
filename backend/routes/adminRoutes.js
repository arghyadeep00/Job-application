import express from "express";
import {
  adminLogin,
  adminRegister,
  getAllApplications,
  updateApplicationStatus,
  fetchUser,
  adminProfile,
  changePassword
} from "../controllers/adminController.js";
import { verifyToken, authorize } from "../middleware/authMiddleware.js";
const router = express.Router();

// registration admin
router.post("/register", adminRegister);
// admin login
router.post("/login", adminLogin);

// admin profile
router.get("/profile", verifyToken, authorize("admin"), adminProfile);

router.get(
  "/applications",
  verifyToken,
  authorize("admin"),
  getAllApplications,
);

router.put(
  "/applications/:id/status",
  verifyToken,
  authorize("admin"),
  updateApplicationStatus,
);

router.get("/fetch-user/:id", verifyToken, authorize("admin"), fetchUser);

// admin password change

router.post("/password-change", verifyToken, authorize("admin"), changePassword);

export default router;
