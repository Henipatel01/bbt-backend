import TimeEntry from "../Model/TimeEntry.js";
import type { Request, Response } from "express";
import mongoose from "mongoose";
console.log("🔥 timeController loaded");
// export const startTimer = async (req: any, res: any) => {
//   try {
//     const adminId = req.user.userId;

//     const { name, email, phone, pricing } = req.body;

//     // 🔴 Validate
//     if (!name || !email) {
//       return res.status(400).json({
//         message: "Name and email required"
//       });
//     }

//     //  Check if timer already running for this email
//     const existingRunning = await TimeEntry.findOne({
//       "customer.email": email,
//       isRunning: true
//     });

//     if (existingRunning) {
//       return res.status(400).json({
//         message: "Timer already running for this customer"
//       });
//     }

//     // 🔥 Check if customer exists (reuse details)
//     const existingCustomer = await TimeEntry.findOne({
//       "customer.email": email
//     });

//     let customerData;

//     if (existingCustomer) {
//       customerData = existingCustomer.customer; // reuse old data
//     } else {
//       customerData = { name, email, phone }; // new customer
//     }

//     const newEntry = await TimeEntry.create({
//       userId: adminId,
//       customer: { name, email, phone },
//       pricing,
//       startTime: new Date(),
//       isRunning: true
//     });

//     // res.status(201).json({
//     //   message: "Timer started",
//     //   data: newEntry
//     // });
//     res.status(201).json({
//       message: "Timer started",
//       data: {
//         _id: newEntry._id,   // ✅ important
//         customer: newEntry.customer,
//         pricing: newEntry.pricing,
//         startTime: newEntry.startTime,
//         isRunning: newEntry.isRunning,
//         duration: newEntry.duration || 0
//       }
//     });
//   } catch (err: any) {
//     res.status(500).json({ message: err.message });
//   }
// };

const pricingValidators: any = {
  hourly: (p: any) => {
    if (!p.ratePerHour) throw new Error("ratePerHour required");
  },

  fixed: (p: any) => {
    if (!p.fixedAmount) throw new Error("fixedAmount required");
  },

  perunit: (p: any) => {
    if (!p.pricePerUnit) {
      throw new Error("pricePerUnit required");
    }
  },

  manual: (_p: any) => {
    // ✅ no validation at start
  },
};

export const startTimer = async (req: Request, res: Response) => {
  console.log("🚀 startTimer function called");
  try {
    /* =========================
       ✅ 1. AUTH CHECK
    ========================= */
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const adminId = new mongoose.Types.ObjectId(userId);

    /* =========================
       ✅ 2. GET DATA
    ========================= */
    const { name, email, phone, pricing } = req.body;
    console.log("START PRICING:", pricing);

    // if (!name || !email) {
    //   return res.status(400).json({
    //     message: "Name and email required",
    //   });
    // }

    if (!pricing || !pricing.type) {
      return res.status(400).json({
        message: "Pricing type required",
      });
    }

    if (!name || name.trim().length < 3) {
  return res.status(400).json({
    message: "Name must be at least 3 characters",
  });
}

if (!email || !email.includes("@")) {
  return res.status(400).json({
    message: "Valid email required",
  });
}

if (!phone || phone.length < 10) {
  return res.status(400).json({
    message: "Valid phone required",
  });
}

    /* =========================
       ✅ 3. NORMALIZE TYPE
    ========================= */
    pricing.type = pricing.type.toLowerCase();

    /* =========================
       ✅ 4. VALIDATE PRICING
    ========================= */
    if (!pricingValidators[pricing.type]) {
      return res.status(400).json({
        message: "Invalid pricing type",
      });
    }

    try {
      pricingValidators[pricing.type](pricing);
    } catch (err: any) {
      return res.status(400).json({
        message: err.message,
      });
    }

    /* =========================
       ✅ 5. PREVENT DUPLICATE TIMER
    ========================= */
    const existingRunning = await TimeEntry.findOne({
      userId: adminId,
      "customer.email": email,
      isRunning: true,
    });

    if (existingRunning) {
      return res.status(400).json({
        message: "Timer already running for this customer",
      });
    }

    /* =========================
       ✅ 6. REUSE CUSTOMER
    ========================= */
    const existingCustomer = await TimeEntry.findOne({
      userId: adminId,
      "customer.email": email,
    });

    const customerData = existingCustomer
      ? existingCustomer.customer
      : { name, email, phone };

    /* =========================
       ✅ 7. CREATE TIMER
    ========================= */
    const newEntry = await TimeEntry.create({
      userId: adminId,
      customer: customerData,
      pricing,
      startTime: new Date(),
      isRunning: true,
      duration: 0,
      amount: 0,
      status: "in-progress",
    });

    /* =========================
       ✅ 8. RESPONSE
    ========================= */
    return res.status(201).json({
      message: "Timer started",
      data: {
        _id: newEntry._id.toString(), // 🔥 timerId
        customer: newEntry.customer,
        pricing: newEntry.pricing,
        startTime: newEntry.startTime,
        isRunning: newEntry.isRunning,
        duration: newEntry.duration,
        amount: newEntry.amount,
        status: newEntry.status,
      },
    });

  } catch (err: any) {
    console.error("Start Timer Error:", err);

    return res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
};
// export const startTimer = async (req: Request, res: Response) => {
//   try {
//     // ✅ 1. Validate user
//     if (!(req as any).user?.userId) {
//       return res.status(401).json({
//         message: "Unauthorized",
//       });
//     }

//     // ✅ 2. Convert string → ObjectId
//     const adminId = new mongoose.Types.ObjectId(
//       (req as any).user.userId
//     );

//     const { name, email, phone, pricing } = req.body;

//     // ✅ 3. Validate input
//     if (!name || !email) {
//       return res.status(400).json({
//         message: "Name and email required",
//       });
//     }

//     // ✅ 4. Prevent duplicate running timer
//     const existingRunning = await TimeEntry.findOne({
//       userId: adminId,
//       "customer.email": email,
//       isRunning: true,
//     });

//     if (existingRunning) {
//       return res.status(400).json({
//         message: "Timer already running for this customer",
//       });
//     }

//     // ✅ 5. Reuse customer if exists
//     const existingCustomer = await TimeEntry.findOne({
//       userId: adminId,
//       "customer.email": email,
//     });

//     let customerData;

//     if (existingCustomer) {
//       customerData = existingCustomer.customer;
//     } else {
//       customerData = { name, email, phone };
//     }

//     // ✅ 6. Create timer
//     const newEntry = await TimeEntry.create({
//       userId: adminId,
//       customer: customerData,
//       pricing,
//       startTime: new Date(),   // 🔥 START TIME
//       isRunning: true,
//       duration: 0,
//       amount: 0,
//       status: "in-progress",
//     });

//     // ✅ 7. Clean response
//     res.status(201).json({
//       message: "Timer started",
//       data: {
//         _id: newEntry._id.toString(),
//         customer: newEntry.customer,
//         pricing: newEntry.pricing,
//         startTime: newEntry.startTime,
//         isRunning: newEntry.isRunning,
//         duration: newEntry.duration,
//         amount: newEntry.amount,
//         status: newEntry.status,
//       },
//     });

//   } catch (err: any) {
//     console.error("Start Timer Error:", err);
//     res.status(500).json({
//       message: "Server Error",
//       error: err.message,
//     });
//   }
// };


// // ⏱️ Get end time
// const endTime = new Date();

// // ⏱️ Calculate duration (minutes)
// const duration =
//   (endTime.getTime() - runningEntry.startTime.getTime()) / (1000 * 60);

// const totalMinutes = Math.round(duration);

// // 💰 Calculate amount based on pricing
// let amount: number = 0;
// const pricing = runningEntry.pricing;

// if (!pricing || !pricing.type) {
//   return res.status(400).json({
//     message: "Pricing not defined"
//   });
// }

// // 🔥 MULTI PRICING LOGIC
// if (pricing.type === "hourly") {
//   amount = (totalMinutes / 60) * (pricing.ratePerHour || 0);
// }

// else if (pricing.type === "fixed") {
//   if (runningEntry.status !== "completed") {
//     amount = 0; // ❌ no payment if not completed
//   } else {
//     amount = pricing.fixedAmount || 0;
//   }
// }
// else if (pricing.type === "perUnit") {
//   amount = (pricing.units || 0) * (pricing.pricePerUnit || 0);
// }
// else if (pricing.type === "manual") {
//   amount = pricing.manualAmount || 0;
// }

// // 💾 Save updates
// runningEntry.endTime = endTime;
// runningEntry.duration = totalMinutes;
// runningEntry.amount = parseFloat(amount.toFixed(2));
// runningEntry.isRunning = false;

// await runningEntry.save();

// // ✅ Clean response
// res.status(200).json({
//   message: "Timer stopped successfully",
//   data: {
//     customer: runningEntry.customer,
//     startTime: runningEntry.startTime,
//     endTime: runningEntry.endTime,
//     totalTime: runningEntry.duration,
//     pricingType: pricing.type,
//     amount: runningEntry.amount
//   }
// });

//   } catch (err: any) {
//   console.error("Stop Timer Error:", err);
//   res.status(500).json({
//     message: "Server Error",
//     error: err.message
//   });
// }
// };

export const stopTimer = async (req: Request, res: Response) => {
  console.log("🚀 stopTimer function called");
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const adminId = new mongoose.Types.ObjectId(userId);

    const { id, units, manualAmount } = req.body;

    // ✅ 1. Validate ID
    if (!id) {
      return res.status(400).json({ message: "Timer ID required" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Timer ID" });
    }

    console.log("ID from request:", id);

    const test = await TimeEntry.findById(id);
    console.log("Found by ID:", test);
    console.log("USER:", adminId);
    console.log("ID:", id);


    
    // ✅ 2. Find running timer (USER SAFE 🔥)
    const runningEntry = await TimeEntry.findOne({
      _id: id,
      userId: adminId,
      isRunning: true,
    });

    console.log("Pricing from DB:", runningEntry?.pricing);
    console.log("Units from request:", req.body.units);


    if (!runningEntry) {
      return res.status(404).json({
        message: "No active timer found",
      });
    }

    // ✅ 3. Set end time
    const endTime = new Date();

    // ✅ 4. Calculate duration (seconds)
    const totalSeconds = Math.floor(
      (endTime.getTime() - runningEntry.startTime.getTime()) / 1000
    );

    const totalMinutes = Math.max(1, Math.ceil(totalSeconds / 60));

    // ✅ 5. Pricing logic (SMART 🔥)
    let amount = 0;
    const pricing = runningEntry.pricing;

    switch (pricing.type) {
      case "hourly":
        amount = (totalMinutes / 60) * (pricing.ratePerHour || 0);
        break;

      case "fixed":
        amount = pricing.fixedAmount || 0;
        break;

      case "perunit":
        if (!units) {
          return res.status(400).json({
            message: "Units required for perunit pricing",
          });
        }
        amount = units * (pricing.pricePerUnit || 0);
        runningEntry.pricing.units = units; // optional save
        break;

      case "manual":
        if (!manualAmount) {
          return res.status(400).json({
            message: "Manual amount required",
          });
        }
        amount = manualAmount;
        console.log("Final amount:", amount);
        break;

      default:
        return res.status(400).json({
          message: "Invalid pricing type",
        });
    }

    // ✅ 6. Format time (optional UI)
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formattedTime = [
      hours ? `${hours}h` : "",
      minutes ? `${minutes}m` : "",
      seconds ? `${seconds}s` : "",
    ]
      .filter(Boolean)
      .join(" ");

    // ✅ 7. Save updates
    runningEntry.endTime = endTime;
    runningEntry.duration = totalSeconds;
    runningEntry.amount = parseFloat(amount.toFixed(2));
    runningEntry.isRunning = false;
    runningEntry.status = "completed";

    await runningEntry.save();

    // ✅ 8. Response
    return res.status(200).json({
      message: "Timer stopped successfully",
      data: {
        _id: runningEntry._id.toString(),
        customer: runningEntry.customer,
        startTime: runningEntry.startTime,
        endTime: runningEntry.endTime,
        time: formattedTime,
        durationInSeconds: totalSeconds,
        pricingType: pricing.type,
        amount: runningEntry.amount,
        status: runningEntry.status,
      },
    });

  } catch (err: any) {
    console.error("Stop Timer Error:", err);

    return res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
};

// export const stopTimer = async (req: Request, res: Response) => {
//   try {
//      console.log("REQ BODY:", req.body); 
//     const { id } = req.body;

//     // ✅ 1. Validate ID
//     if (!id) {
//       return res.status(400).json({
//         message: "Timer ID required",
//       });
//     }

//     // ✅ 2. Find running timer
//     const runningEntry = await TimeEntry.findById(id);

//     if (!runningEntry || runningEntry.endTime) {
//   return res.status(400).json({
//     message: "No active timer found",
//   });
// }

//     // ✅ 3. End time
//     const endTime = new Date();

//     // ✅ 4. Calculate total seconds
//     const totalSeconds = Math.floor(
//       (endTime.getTime() - runningEntry.startTime.getTime()) / 1000
//     );

//     // ✅ 5. Convert to hours, minutes, seconds
//     const hours = Math.floor(totalSeconds / 3600);
//     const minutes = Math.floor((totalSeconds % 3600) / 60);
//     const seconds = totalSeconds % 60;

//     // ✅ 6. Format time (clean)
//     const formattedTime = [
//       hours ? `${hours}h` : "",
//       minutes ? `${minutes}m` : "",
//       seconds ? `${seconds}s` : "",
//     ]
//       .filter(Boolean)
//       .join(" ");

//     // ✅ 7. Billing (use minutes)
//     const totalMinutes = Math.max(1, Math.ceil(totalSeconds / 60));

//     let amount = 0;
//     const pricing = runningEntry.pricing;

//     if (!pricing || !pricing.type) {
//       return res.status(400).json({
//         message: "Pricing not defined",
//       });
//     }

//     if (pricing.type === "hourly") {
//       amount = (totalMinutes / 60) * (pricing.ratePerHour || 0);
//     } else if (pricing.type === "fixed") {
//       amount = pricing.fixedAmount || 0;
//     } else if (pricing.type === "perunit") {
//       amount =
//         (pricing.units || 0) * (pricing.pricePerUnit || 0);
//     } else if (pricing.type === "manual") {
//       amount = pricing.manualAmount || 0;
//     }

//     // ✅ 8. Save
//     runningEntry.endTime = endTime;
//     runningEntry.duration = totalSeconds; // store seconds
//     runningEntry.amount = parseFloat(amount.toFixed(2));
//     runningEntry.isRunning = false;
//     runningEntry.status = "completed";

//     await runningEntry.save();

//     // ✅ 9. Response
//     res.status(200).json({
//       message: "Timer stopped successfully",
//       data: {
//         _id: runningEntry._id.toString(),
//         customer: runningEntry.customer,
//         startTime: runningEntry.startTime,
//         endTime: runningEntry.endTime,

//         // 🔥 MAIN OUTPUT
//         time: formattedTime,

//         durationInSeconds: totalSeconds,
//         pricingType: pricing.type,
//         amount: runningEntry.amount,
//         status: runningEntry.status,
//       },
//     });

//   } catch (err: any) {
//     console.error("Stop Timer Error:", err);
//     res.status(500).json({
//       message: "Server Error",
//       error: err.message,
//     });
//   }
// };




export const getAllTimers = async (req: any, res: any) => {
  try {
    const timers = await TimeEntry.find();

    res.status(200).json({
      data: timers
    });

  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// 🔥 GET ACTIVE TIMER WITH USER INFO
export const getActiveTimer = async (req: any, res: any) => {
  try {
    const userId = req.user.userId;

    const activeTimer = await TimeEntry.findOne({
      userId,
      isRunning: true
    })
      .populate("userId", "name email")
      .populate("projectId", "title ratePerHour");

    if (!activeTimer) {
      return res.status(404).json({
        message: "No active timer"
      });
    }

    res.status(200).json({
      message: "Active timer found",
      data: activeTimer
    });

  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};