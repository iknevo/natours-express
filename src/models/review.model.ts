import { Tour } from "@/models/tour.model";
import { InferSchemaType, model, Query, Schema, Types } from "mongoose";

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
    statics: {
      async calcAverageRating(tourId: Types.ObjectId) {
        const stats = await this.aggregate([
          { $match: { tour: tourId } },
          {
            $group: {
              _id: "$tour",
              numRatings: { $sum: 1 },
              avgRating: { $avg: "$rating" },
            },
          },
        ]);
        if (stats.length > 0) {
          await Tour.findByIdAndUpdate(tourId, {
            ratingsAverage: stats[0].avgRating,
            ratingsQuantity: stats[0].numRatings,
          });
        } else {
          await Tour.findByIdAndUpdate(tourId, {
            ratingsAverage: 4.5,
            ratingsQuantity: 0,
          });
        }
      },
    },
  },
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.post("save", async function () {
  await Review.calcAverageRating(this.tour);
});

reviewSchema.pre<Query<reviewType[], reviewType>>(
  /^findOneAnd/,
  async function (next) {
    (this as any).rev = await this.model.findOne(this.getQuery());
    next();
  },
);

reviewSchema.post(/^findOneAnd/, async function () {
  await Review.calcAverageRating((this as any).rev.tour);
});

reviewSchema.pre<Query<reviewType[], reviewType>>(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});

type reviewType = InferSchemaType<typeof reviewSchema>;
export const Review = model("Review", reviewSchema);
