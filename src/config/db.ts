import mongoose from "mongoose";
import config from "@/config/config";

const dbConnect = () =>
  mongoose
    .connect(config.database)
    .then(() => console.log("DATABASE connected."))
    .catch((error) => console.log("error connecting to db", error));

export default dbConnect;
