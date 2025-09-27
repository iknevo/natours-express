import dbConnect from "@/config/db";
import { Tour } from "@/modules/tour/tour.model";
import { tours } from "./data";

const createData = async () => {
  try {
    await dbConnect();
    await Tour.create(tours);
    console.log("Tours seeded to DB");
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
    console.log("Tours deleted from DB");
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
