import { InferSchemaType, model, models, Schema } from "mongoose";

const toursSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "A tour must have a name!"],
    },
    duration: {
      type: Number,
      required: [true, "A tour must have a duration!"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size!"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a group size!"],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price!"],
    },
    discount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a summary!"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have an image!"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
  },
  {
    toJSON: { virtuals: true },
  },
);
toursSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

type TourType = InferSchemaType<typeof toursSchema>;
export const Tour = models.Tour || model<TourType>("Tour", toursSchema);
