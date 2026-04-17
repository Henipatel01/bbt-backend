import mongoose, { Document } from "mongoose";

export interface ICustomer extends Document {
  userId: mongoose.Types.ObjectId;

  name: string;
  email: string;
  phone?: string;

  pricing: {
    type: "hourly" | "fixed" | "perunit" | "manual";
    ratePerHour?: number;
    fixedAmount?: number;
    pricePerUnit?: number;
  };
}

const CustomerSchema = new mongoose.Schema<ICustomer>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    name: {
      type: String,
      required: true,
      minlength: 3,
    },

    email: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
    },

    pricing: {
      type: {
        type: String,
        enum: ["hourly", "fixed", "perunit", "manual"],
        required: true,
      },
      ratePerHour: Number,
      fixedAmount: Number,
      pricePerUnit: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ICustomer>("Customer", CustomerSchema);