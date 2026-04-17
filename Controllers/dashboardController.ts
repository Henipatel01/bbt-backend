// // import TimeEntry from "../Model/TimeEntry.js";

// // export const getDashboardStats = async (req: any, res: any) => {
// //   try {
// //     // 📊 Total Clients (unique names)
// //     const totalClients = await TimeEntry.distinct("customer.email");

// //     // 🟢 Active timers
// //     const activeNow = await TimeEntry.countDocuments({
// //       isRunning: true
// //     });

// //     // 💰 Total Earned
// //     const earningsData = await TimeEntry.aggregate([
// //       {
// //         $group: {
// //           _id: null,
// //           total: { $sum: "$amount" }
// //         }
// //       }
// //     ]);

// //     const totalEarned = earningsData[0]?.total || 0;

// //     // ⏱️ Total Minutes
// //     const timeData = await TimeEntry.aggregate([
// //       {
// //         $group: {
// //           _id: null,
// //           total: { $sum: "$duration" }
// //         }
// //       }
// //     ]);

// //     const totalMinutes = timeData[0]?.total || 0;

// //     res.status(200).json({
// //       totalClients: totalClients.length,
// //       activeNow,
// //       totalEarned,
// //       totalMinutes
// //     });

// //   } catch (err: any) {
// //     res.status(500).json({ message: err.message });
// //   }
// // };


// import TimeEntry from "../Model/TimeEntry.js";
// import type { Request, Response } from "express";

// /* =========================
//    ⏱️ FORMAT TIME FUNCTION
// ========================= */
// const formatTime = (totalSeconds: number) => {
//   const hours = Math.floor(totalSeconds / 3600);
//   const minutes = Math.floor((totalSeconds % 3600) / 60);
//   const seconds = totalSeconds % 60;

//   return [
//     hours ? `${hours}h` : "",
//     minutes ? `${minutes}m` : "",
//     seconds ? `${seconds}s` : "",
//   ]
//     .filter(Boolean)
//     .join(" ");
// };

// /* =========================
//    📊 DASHBOARD STATS
// ========================= */
// export const getDashboardStats = async (req: Request, res: Response) => {
//   try {
//     // ✅ userId from auth
//     const userId = (req as any).user?.userId;

//     if (!userId) {
//       return res.status(401).json({
//         message: "Unauthorized",
//       });
//     }

//     // ✅ Get all timers for this user
//     const timers = await TimeEntry.find({ userId });

//     /* =========================
//        📊 CALCULATIONS
//     ========================= */
//     let totalSeconds = 0;
//     let totalEarned = 0;

//     const activeTimers = timers.filter((t) => t.isRunning);

//     timers.forEach((t) => {
//       totalSeconds += t.duration || 0; // 🔥 stored in seconds
//       totalEarned += t.amount || 0;
//     });

//     // ✅ Unique clients (by email)
//     const uniqueClients = new Set(
//       timers.map((t) => t.customer?.email)
//     );

//     /* =========================
//        🔥 FINAL RESPONSE
//     ========================= */
//     res.status(200).json({
//       totalClients: uniqueClients.size,
//       activeNow: activeTimers.length,
//       totalEarned: parseFloat(totalEarned.toFixed(2)),

//       // 🔥 THIS FIXES YOUR ISSUE
//       totalTime: formatTime(totalSeconds),

//       // optional debug
//       totalSeconds,
//     });

//   } catch (err: any) {
//     console.error("Dashboard Error:", err);
//     res.status(500).json({
//       message: "Server Error",
//       error: err.message,
//     });
//   }
// };

import TimeEntry from "../Model/TimeEntry.js";
import type { Request, Response } from "express";

/* =========================
   ⏱️ FORMAT TIME FUNCTION
========================= */
const formatTime = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [
    hours ? `${hours}h` : "",
    minutes ? `${minutes}m` : "",
    seconds ? `${seconds}s` : "",
  ]
    .filter(Boolean)
    .join(" ") || "0s"; // ✅ FIX (fallback)
};

/* =========================
   📊 DASHBOARD STATS
========================= */
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // ✅ FIX: ensure only user-specific data
    const timers = await TimeEntry.find({
      userId: userId, // (explicit for clarity)
    });

    let totalSeconds = 0;
    let totalEarned = 0;

    const activeTimers = timers.filter((t) => t.isRunning);

    timers.forEach((t) => {
      totalSeconds += t.duration || 0;
      totalEarned += t.amount || 0;
    });

    // ✅ FIX: remove undefined emails
    const uniqueClients = new Set(
      timers
        .map((t) => t.customer?.email)
        .filter(Boolean) // ✅ prevents undefined
    );

//     const uniqueClients = new Set(
//   timers
//     .map((t) => t.customer?.email?.toLowerCase().trim())
//     .filter((email) => email && email !== "")
// );

// const uniqueClients = await TimeEntry.aggregate([
//   { $match: { userId } },
//   {
//     $group: {
//       _id: { $toLower: "$customer.email" }
//     }
//   }
// ]);

// const totalClients = uniqueClients.length;

console.log("UNIQUE CLIENTS:", [...uniqueClients]);
console.log("COUNT:", uniqueClients.size);

    res.status(200).json({
      totalClients: uniqueClients.size,
      activeNow: activeTimers.length,
      totalEarned: parseFloat(totalEarned.toFixed(2)),
      totalTime: formatTime(totalSeconds),
      totalSeconds,
    });

  } catch (err: any) {
    console.error("Dashboard Error:", err);
    res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
};