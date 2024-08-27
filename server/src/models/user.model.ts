import mongoose from "mongoose";
import { compareValue, hashValue } from "../utils/bcrypt";

export interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
  resetToken?: string;
  resetTokenExpiration?: Date;
  roles: string[]; // Changed from single role to an array of roles
  comparePassword(candidatePassword: string): Promise<boolean>;
  omitPassword(): Pick<UserDocument, "_id" | "email" | "roles" | "__v">; // Updated omitPassword
}

const userSchema = new mongoose.Schema<UserDocument>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetToken: String,
  resetTokenExpiration: Date,
  roles: {
    type: [String],
    enum: ["user", "admin", "manager"],
    default: ["user"], // Default role is an array containing only "user"
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await hashValue(this.password);
  next();
});

userSchema.methods.comparePassword = async function (value: string) {
  return compareValue(value, this.password);
};

userSchema.methods.omitPassword = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
