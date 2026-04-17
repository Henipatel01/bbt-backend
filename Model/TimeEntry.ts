

import mongoose, { Document } from "mongoose";

export interface ITimeEntry extends Document {
  userId: mongoose.Types.ObjectId;

  customer: {
    name: string;
    email: string;
    phone?: string;
  };

  pricing: {
    type: "hourly" | "fixed" | "perunit" | "manual";
    ratePerHour?: number;
    fixedAmount?: number;
    units?: number;
    pricePerUnit?: number;
    manualAmount?: number;
  };

  startTime: Date;
  endTime?: Date | null;

  duration: number;
  amount: number;

  isRunning: boolean;
  status: "in-progress" | "completed";
}

const TimeEntrySchema = new mongoose.Schema<ITimeEntry>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    customer: {
      name: {
        type: String,
        required: true,
        minlength: 3
      },
      email: {
        type: String,
        required: true,
        match: /.+\@.+\..+/
      },
      phone: {
        type: String,
        minlength: 10
      }
    },

    pricing: {
      type: {
        type: String,
        enum: ["hourly", "fixed", "perunit", "manual"],
        default: "hourly",
      },
      ratePerHour: Number,
      fixedAmount: Number,
      units: Number,
      pricePerUnit: Number,
      manualAmount: Number,
    },

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
      default: null,
    },

    duration: {
      type: Number,
      default: 0,
    },

    amount: {
      type: Number,
      default: 0,
    },

    isRunning: {
      type: Boolean,
      default: true, // ✅ FIXED
    },

    status: {
      type: String,
      enum: ["in-progress", "completed"],
      default: "in-progress",
    },
  },
  { timestamps: true }
);

export default mongoose.model<ITimeEntry>("TimeEntry", TimeEntrySchema);