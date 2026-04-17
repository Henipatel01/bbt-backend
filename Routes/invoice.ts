import express from "express";
import { createInvoice, getInvoices } from "../Controllers/invoiceController.js";
import { authMiddleware } from "../Middleware/authMiddleware.js";

console.log("✅ Invoice Routes Loaded");

const router = express.Router();


router.post("/create", authMiddleware, createInvoice);
router.get("/list", authMiddleware, getInvoices);

export default router;