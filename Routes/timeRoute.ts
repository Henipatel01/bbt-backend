import express from "express";
import { startTimer, stopTimer, getActiveTimer } from "../Controllers/timeController.js";
import { authMiddleware } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/start", authMiddleware, startTimer);
router.post("/stop", authMiddleware, stopTimer);
router.get("/active", authMiddleware, getActiveTimer);

export default router;