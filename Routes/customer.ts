import express from "express";
import { createCustomer, getCustomerList, updateCustomer ,deleteCustomer} from "../Controllers/customerController.js";
import { authMiddleware } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createCustomer);
router.get("/list", authMiddleware, getCustomerList);

router.put("/update/:id", authMiddleware, updateCustomer);
// router.delete("/delete/:id", authMiddleware, deleteCustomer);
router.delete(
  "/delete/:id",
  authMiddleware,
  (req, res, next) => {
    console.log("DELETE ROUTE HIT:", req.params.id);
    console.log("Customer Routes Loaded");
    next();
  },
  deleteCustomer
);

export default router;