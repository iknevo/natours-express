import config from "@/config/config";
import mongoose from "mongoose";

const dbConnect = async (): Promise<void> => {
  try {
    await mongoose.connect(config.database, {
      dbName: config.databaseName,
    });
    console.log("DATABASE connected.");
  } catch (error) {
    console.error("error connecting to db", error);
    throw error;
  }
};

export default dbConnect;
