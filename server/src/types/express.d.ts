import { UserDocument } from "../models/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument; // Ensure UserDocument includes role and _id
    }
  }
}
