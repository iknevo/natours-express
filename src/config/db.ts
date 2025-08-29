import mongoose from "mongoose";

const dbConnect = () =>
  mongoose
    .connect(process.env.DB_URL!)
    .then(() => console.log("DATABASE connected."))
    .catch((error) => console.log("error connecting to db", error));

export default dbConnect;
