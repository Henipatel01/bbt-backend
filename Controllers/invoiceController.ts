import type{ Request, Response } from "express";
import Invoice from "../Model/invoiceModel.js";

export const createInvoice = async (req: Request, res: Response) => {
  try {
    const invoice = await Invoice.create(req.body);

    res.status(201).json({
      success: true,
      data: invoice,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getInvoices = async (req: Request, res: Response) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: invoices,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};