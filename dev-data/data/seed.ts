import { readFileSync } from "node:fs";
import dbConnect from "../../src/config/db";
import { Tour } from "../../src/models/tour.model";
import { tours } from "../../src/scripts/data";

const createData = async () => {
  try {
    await dbConnect();
    await Tour.create(tours);
    console.log("Tours seeded to DB");
  } catch (error) {
    console.error(error);
  }
};

const deleteData = async () => {
  try {
    await dbConnect();
    await Tour.deleteMany();
    console.log("Tours deleted from DB");
  } catch (error) {
    console.error(error);
  }
};

console.log(process.argv);
