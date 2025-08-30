import mongoose from "mongoose";
import config from "@/config/config";

const dbConnect = async (): Promise<void> => {
  try {
    await mongoose.connect(config.database, {
      dbName: config.databaseName,
    });
    console.log("DATABASE connected.");
  } catch (error) {
    console.error("error connecting to db", error);
  }
};

export default dbConnect;
