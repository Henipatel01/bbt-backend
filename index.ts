import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

console.log("ENV:", process.env.MONGODBURL);
import express from "express";
import cors from "cors";


import router from "./Routes/auth.js";
import connectDb from "./Model/db.js";
import errorMiddleware from "./Middleware/error-middleware.js"

import timeRoutes from "./Routes/timeRoute.js";
import dashboardRoutes from "./Routes/dashboard.js";

import customerRoutes from "./Routes/customer.js";
import invoiceRoutes from "./Routes/invoice.js";





const app=express()

app.use(cors());

app.use(express.json())

// Mount the Router: To use the router in your main Express app, you can "mount" it at a specific URL prefix
app.use("/api/auth", router);
app.use("/api/time", timeRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use(errorMiddleware);
const PORT = 8080;
connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`server is running at port: ${PORT}`);
  });
});
