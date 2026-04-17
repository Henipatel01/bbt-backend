import express from "express";
import { getDashboardStats } from "../Controllers/dashboardController.js";
import { authMiddleware } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", authMiddleware, getDashboardStats);

export default router;