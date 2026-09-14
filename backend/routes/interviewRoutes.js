import express from 'express'
import { interviewSchedule, interviewDetails } from '../controllers/interviewController.js';
import { authorize, verifyToken } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post("/schedule", verifyToken, authorize("admin"), interviewSchedule)
router.get("/interview-details", verifyToken, authorize("user"), interviewDetails);






export default router;