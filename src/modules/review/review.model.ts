import { InferSchemaType, Model, model, models, Query, Schema } from "mongoose";

const reviewSchema = new Schema(
  {
    review: {
      type: String,
      required: [true, "A review can't be empty!"],
    },
    rating: { type: Number, min: 1, max: 5 },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review must belong to a tour"],
    },
    user: {
      type: Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchema.pre<Query<reviewType[], reviewType>>(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name",
  });
  next();
});

type reviewType = InferSchemaType<typeof reviewSchema>;
export const Review: Model<reviewType> =
  models.Review || model<reviewType>("Review", reviewSchema);
