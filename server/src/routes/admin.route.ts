import express from "express";
import {
  createUser,
  deleteUser,
  getAllProducts,
  getAllUsers,
} from "../controllers/admin.controller";
import { authenticate, authorize } from "../middlewares/authMiddleware";

const adminRoutes = express.Router();

adminRoutes.get("/all", authenticate, authorize(["admin"]), getAllUsers);
adminRoutes.post("/add", authenticate, authorize(["admin"]), createUser);
adminRoutes.delete(
  "/remove/:userId",
  authenticate,
  authorize(["admin"]),
  deleteUser
);
adminRoutes.delete(
  "/remove/:userId",
  authenticate,
  authorize(["admin"]),
  deleteUser
);
adminRoutes.get(
  "/products/all",
  authenticate,
  authorize(["admin"]),
  getAllProducts
);

export default adminRoutes;
