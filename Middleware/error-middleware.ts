import AppError from "../Model/AppError.js";
import type { Request, Response, NextFunction } from "express";
const errorMiddleware = (err:unknown, req:Request, res:Response, next:NextFunction) => {
  // const statusCode = err.statusCode || 500;
if (err instanceof AppError) {
  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
}
  // return res.status(statusCode).json({
  //   success: false,
  //   message: err.message || "Internal Server Error",
  // });

    if (err instanceof Error) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }

  // 3️⃣ Handle unknown errors
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};




export default errorMiddleware;