import TimeEntry from "../Model/TimeEntry.js";
import type{ Request, Response } from "express";
import mongoose from "mongoose";
import Customer from "../Model/Customer.js";


export const updateCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCustomer) {
      res.status(404).json({
        success: false,
        message: "Customer not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      data: updatedCustomer,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Update failed",
      error: error.message,
    });
  }
};


export const deleteCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const deletedCustomer = await Customer.findByIdAndDelete(id);

    if (!deletedCustomer) {
      res.status(404).json({
        success: false,
        message: "Customer not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Delete failed",
      error: error.message,
    });
  }
};

export const createCustomer = async (req: Request, res: Response) => {
  console.log("CREATE CUSTOMER HIT:", req.body);
  try {
    const userId = (req as any).user?.userId;
    console.log("USER OBJECT:", (req as any).user);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name, email, phone, pricing } = req.body;

    // 🔴 Validation
    if (!name || name.trim().length < 3) {
      return res.status(400).json({ message: "Name must be at least 3 characters" });
    }

    if (!email || !email.includes("@")) {
      return res.status(400).json({ message: "Valid email required" });
    }

    if (!pricing || !pricing.type) {
      return res.status(400).json({ message: "Pricing required" });
    }

    // ✅ Pricing validation
if (pricing.type === "hourly") {
  if (
    pricing.ratePerHour === undefined ||
    pricing.ratePerHour === null ||
    pricing.ratePerHour === "" ||
    Number(pricing.ratePerHour) <= 0
  ) {
    return res.status(400).json({ message: "Valid ratePerHour required" });
  }
}

if (pricing.type === "fixed") {
  if (
    pricing.fixedAmount === undefined ||
    pricing.fixedAmount === null ||
    pricing.fixedAmount === "" ||
    Number(pricing.fixedAmount) <= 0
  ) {
    return res.status(400).json({ message: "Valid fixedAmount required" });
  }
}

if (pricing.type === "perunit") {
  if (
    pricing.pricePerUnit === undefined ||
    pricing.pricePerUnit === null ||
    pricing.pricePerUnit === "" ||
    Number(pricing.pricePerUnit) <= 0
  ) {
    return res.status(400).json({ message: "Valid pricePerUnit required" });
  }
}
// ✅ Pricing validation
if (pricing.type === "hourly") {
  if (
    pricing.ratePerHour === undefined ||
    pricing.ratePerHour === null ||
    pricing.ratePerHour === "" ||
    Number(pricing.ratePerHour) <= 0
  ) {
    return res.status(400).json({ message: "Valid ratePerHour required" });
  }
}

if (pricing.type === "fixed") {
  if (
    pricing.fixedAmount === undefined ||
    pricing.fixedAmount === null ||
    pricing.fixedAmount === "" ||
    Number(pricing.fixedAmount) <= 0
  ) {
    return res.status(400).json({ message: "Valid fixedAmount required" });
  }
}

if (pricing.type === "perunit") {
  if (
    pricing.pricePerUnit === undefined ||
    pricing.pricePerUnit === null ||
    pricing.pricePerUnit === "" ||
    Number(pricing.pricePerUnit) <= 0
  ) {
    return res.status(400).json({ message: "Valid pricePerUnit required" });
  }
}
// mannual validation not need

    // 🔥 Prevent duplicate customer
    const existing = await Customer.findOne({
      userId,
      email,
    });

    if (existing) {
      return res.status(400).json({ message: "Customer already exists" });
    }

    const customer = await Customer.create({
      userId: new mongoose.Types.ObjectId(userId),
      // userId: userId,
      name,
      email,
      phone,
      pricing,
    });
console.log("SAVED CUSTOMER:", customer);
    return res.status(201).json({
      message: "Customer created",
      data: customer,
    });

  } catch (err: any) {
    console.error("Create Customer Error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getCustomerList = async (req: Request, res: Response) => {
  try {
       const userId = (req as any).user?.userId;

    console.log("USER OBJECT:", (req as any).user);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // ✅ Convert to ObjectId so it matches what's stored
    const customers = await Customer.find({ 
      userId: new mongoose.Types.ObjectId(userId) 
      // userId: userId
    });

    return res.status(200).json({
      count: customers.length,
      data: customers,
    });

  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
// export const getCustomerList = async (req: any, res: any) => {
//   try {
//     const customers = await TimeEntry.aggregate([
//       {
//         $group: {
//           _id: "$customer.email", // 🔥 group by email

//           name: { $first: "$customer.name" },
//           email: { $first: "$customer.email" },
//           phone: { $first: "$customer.phone" },

//           totalTime: { $sum: "$duration" },
//           totalAmount: { $sum: "$amount" },

//           active: {
//             $sum: {
//               $cond: [{ $eq: ["$isRunning", true] }, 1, 0]
//             }
//           }
//         }
//       },

//       {
//         $project: {
//           _id: 0,
//           name: 1,
//           email: 1,
//           phone: 1,
//           totalTime: { $ifNull: ["$totalTime", 0] },
//           totalAmount: { $ifNull: ["$totalAmount", 0] },
//           isActive: { $gt: ["$active", 0] }
//         }
//       },

//       {
//         $sort: { totalAmount: -1 } // 🔥 highest earning first
//       }
//     ]);

//     res.status(200).json({
//       count: customers.length,
//       data: customers
//     });

//   } catch (err: any) {
//     res.status(500).json({ message: err.message });
//   }
// };