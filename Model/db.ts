
import mongoose from "mongoose"

const connectDb = async (): Promise<void> => {
  try {
    const mongoUrl = process.env.MONGODBURL as string
    console.log("DB ENV:", process.env.MONGODBURL);
      if (!mongoUrl) {
      throw new Error("MONGODBURL is missing");
    }
    await mongoose.connect(mongoUrl);
    console.log("connection successful to DB");
   
  } catch (error) {
    console.error("database connection fail");
    process.exit(1);
  }
};

export default connectDb;