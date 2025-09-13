import bcrypt from "bcryptjs";
import { InferSchemaType, Model, model, models, Schema } from "mongoose";
import validator from "validator";

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"],
  },
  email: {
    type: String,
    required: [true, "A user must have an email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: String,
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "password must be atleast 8 characters"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "confirm your password"],
    validate: {
      validator: function (this: UserType, value: string) {
        return this.password === value;
      },
      message: "Passwords must match",
    },
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.set("passwordConfirm", undefined);
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePass: string,
  userPass: string,
) {
  return await bcrypt.compare(candidatePass, userPass);
};

type UserType = InferSchemaType<typeof userSchema>;
interface UserDocument extends InferSchemaType<typeof userSchema> {
  correctPassword(candidatePass: string, userPass: string): Promise<boolean>;
}
export const User: Model<UserDocument> =
  models.User || model<UserDocument>("User", userSchema);
