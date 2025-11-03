import dbConnect from "@/config/db";
import { Review } from "@/models/review.model";
import { Tour } from "@/models/tour.model";
import { User } from "@/models/user.model";
import { reviews, tours, users } from "./data";

const createData = async () => {
  try {
    await dbConnect();
    await Tour.create(tours);
    await User.create(users, {
      validateBeforeSave: false,
    });
    await Review.create(reviews);
    console.log("Tours seeded to DB");
    console.log("Users seeded to DB");
    console.log("Reviews seeded to DB");
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
};

const deleteData = async () => {
  try {
    await dbConnect();
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("Tours deleted from DB");
    console.log("Users deleted from DB");
    console.log("Reviews deleted from DB");
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
};

if (process.argv[2] === "--create") {
  await createData();
} else if (process.argv[2] === "--delete") {
  await deleteData();
}
