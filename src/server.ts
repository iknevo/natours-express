import app from "@/app";
import "dotenv/config";
import mongoose from "mongoose";
import config from "@/config/config";

const toursSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, "A tour must have a name!"],
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price!"],
  },
});

const Tour = mongoose.model("Tour", toursSchema);

const { port } = config;
app.listen(port, () => {
  console.log(`🚀 Server ready at http://localhost:${port}`);
});
