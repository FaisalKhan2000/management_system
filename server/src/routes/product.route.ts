import express from "express";

import {
  createProductHandler,
  deleteProductByIdHandler,
  getAllProductsHandler,
  getPaginatedProductsHandler,
  getProductByIdHandler,
  updateProductByIdHandler,
  updateStockLevelHandler,
} from "../controllers/product.controller";
import upload from "../config/multer.config";
import { authenticate, authorize } from "../middlewares/authMiddleware";
const productRoutes = express.Router();

// productRoutes.post("/create", createProductHandler);
// productRoutes.get("/all", getAllProductsHandler);
// productRoutes.put("/update/:productId", updateProductByIdHandler);
// productRoutes.get("/:productId", getProductByIdHandler);
// productRoutes.delete("/:productId", deleteProductByIdHandler);

// Route to create a product
productRoutes.post(
  "/create",
  authenticate,
  authorize(["admin"]),
  upload.single("image"),
  createProductHandler
);

// Route to get all products
productRoutes.get(
  "/all",
  authenticate,
  authorize(["user", "admin", "manager"]),
  getAllProductsHandler
);

// Route to update a product by ID
productRoutes.put(
  "/update/:productId",
  authenticate,
  authorize(["manager"]),
  upload.single("image"),
  updateProductByIdHandler
);

// Route to get a product by ID
productRoutes.get(
  "/:productId",
  authenticate,
  authorize(["admin"]),
  getProductByIdHandler
);

// Route to delete a product by ID
productRoutes.delete(
  "/:productId",
  authenticate,
  authorize(["admin"]),
  deleteProductByIdHandler
);

// Route to get paginated and searched products
productRoutes.get(
  "/",
  authenticate,
  authorize(["user", "admin", "manager"]),
  getPaginatedProductsHandler
);
export default productRoutes;

productRoutes.patch(
  "/:productId/stock",
  authenticate,
  authorize(["manager"]),
  updateStockLevelHandler
);
