import { InferSchemaType, Model, model, models, Query, Schema } from "mongoose";
import slugify from "slugify";

const toursSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "A tour must have a name!"],
      minlength: [10, "Tour name can't be less than 10 characters"],
      maxlength: [40, "Tour name can't be more than 40 characters"],
      // validate: [validator.isAlpha, "Tour name can only contain characters"],
    },
    slug: String,
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
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either: easy, medium, or difficult.",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Ratings average must be above 1.0"],
      max: [5, "Ratings average must be below 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price!"],
    },
    discount: {
      type: Number,
      validate: {
        validator: function (this: TourType, value: number) {
          return value < this.price;
        },
        message: "Discount ({VALUE}) should be less that Tour price",
      },
    },
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
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

toursSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

// only works with .save() and .create()
toursSchema.pre("save", function (next) {
  this.slug = slugify(this.name, {
    lower: true,
    trim: true,
  });
  next();
});

interface QueryWithTimer<T, Y> extends Query<T, Y> {
  start: number;
}

toursSchema.pre<QueryWithTimer<any, any>>(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

toursSchema.post<QueryWithTimer<any, any>>(/^find/, function (_, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

toursSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

type TourType = InferSchemaType<typeof toursSchema>;
export const Tour: Model<TourType> =
  models.Tour || model<TourType>("Tour", toursSchema);
