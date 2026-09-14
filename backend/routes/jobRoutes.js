import express from "express";
import {
  allJobs,
  applyJob,
  postJob,
  fetchAppliedJobs,
  updateJobDetails,
  deleteJob,
  
} from "../controllers/jobController.js";
import { verifyToken, authorize } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/job/post-job", verifyToken, authorize("admin"), postJob);
router.get("/job/all-jobs", verifyToken, authorize("admin", "user"), allJobs);
router.post("/job/apply-job", verifyToken, authorize("user"), applyJob);
router.get(
  "/job/fetch-applied-jobs",
  verifyToken,
  authorize("user"),
  fetchAppliedJobs,
);


router.patch(
  "/job/update-job-details",
  verifyToken,
  authorize("admin"),
  updateJobDetails,
);

router.delete(
  "/job/delete-job/:id",
  verifyToken,
  authorize("admin"),
  deleteJob,
);

export default router;
