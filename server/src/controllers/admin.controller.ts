import { CONFLICT, CREATED, FORBIDDEN, NOT_FOUND, OK } from "../constants/http";
import { ProductModel } from "../models/product.model";
import UserModel from "../models/user.model";
import { createAccount } from "../services/auth.services";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/catchErrors";
import { registerSchema } from "./auth.schemas";

// route access - admin
export const createUser = catchErrors(async (req, res, next) => {
  // validate request

  const request = registerSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  // Check if user already exists
  const existingUser = await UserModel.findOne({ email: request.email });
  appAssert(!existingUser, CONFLICT, "Email already in use");

  const user = await UserModel.create(request);

  // return response
  return res.status(CREATED).json(user);
});

// route access - admin
export const deleteUser = catchErrors(async (req, res, next) => {
  const userId = req.params.userId;

  const user = await UserModel.findById(userId);
  appAssert(user, 404, `No user with user id: ${userId}`);

  // Check if the user is an admin
  appAssert(
    !user.roles.includes("admin"),
    FORBIDDEN,
    "Cannot delete admin users"
  );

  // delete user
  await UserModel.deleteOne({ _id: user._id });

  // return response
  return res.status(OK).json({ message: "user deleted successfully" });
});

// get all users
export const getAllUsers = catchErrors(async (req, res, next) => {
  const users = await UserModel.find({});
  appAssert(users, 404, `No Users`);

  // return response
  return res.status(OK).json(users);
});

// get all products
export const getAllProducts = catchErrors(async (req, res, next) => {
  const products = await ProductModel.find({});
  appAssert(products.length > 0, NOT_FOUND, "No products found");

  // return response
  return res.status(OK).json(products);
});
