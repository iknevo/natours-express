import app from "@/app";
import config from "@/config/config";
import dbConnect from "@/config/db";
import "dotenv/config";
import mongoose from "mongoose";

const { port } = config;

process.on("uncaughtException", (err) => {
  console.error("💥 UNCAUGHT EXCEPTION! Shutting down...");
  console.error(err);
  process.exit(1);
});

let server: ReturnType<typeof app.listen>;

(async () => {
  try {
    await dbConnect();

    server = app.listen(port, () => {
      console.log(`🚀 Server ready at http://localhost:${port}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to database", err);
    process.exit(1);
  }
})();

process.on("unhandledRejection", (err: any) => {
  console.error("💥 UNHANDLED REJECTION! Shutting down...");
  console.error(err);

  if (server) {
    server.close(async () => {
      await mongoose.connection.close();
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on("SIGTERM", async () => {
  console.log("🛑 SIGTERM RECEIVED. Shutting down gracefully...");
  if (server) {
    server.close(async () => {
      await mongoose.connection.close();
      console.log("💤 Process terminated");
    });
  }
});
