import { CREATED, OK } from "../constants/http";
import {
  createProduct,
  deleteProductById,
  getAllProducts,
  getPaginatedProducts,
  getProductById,
  updateProductById,
  updateProductStock,
} from "../services/product.services";
import catchErrors from "../utils/catchErrors";
import { createProductSchema, updateProductSchema } from "./product.schemas";

// Create a product
export const createProductHandler = catchErrors(async (req, res, next) => {
  const { name, description, price, stockQuantity, category } = req.body;
  const image = req.file?.path;

  // Create the product with the createdBy field
  const product = await createProduct({
    name,
    description,
    price,
    stockQuantity,
    category,
    image,
    createdBy: req.user?._id as string,
  });

  return res.status(CREATED).json(product);
});

// Get all products created by the authenticated user
export const getAllProductsHandler = catchErrors(async (req, res, next) => {
  const createdBy = req.user?._id as string;
  const products = await getAllProducts(createdBy);

  return res.status(OK).json(products);
});

export const getProductByIdHandler = catchErrors(async (req, res, next) => {
  const productId = req.params.productId;
  const createdBy = req.user?._id as string;

  const product = await getProductById(productId, createdBy);

  return res.status(OK).json(product);
});

export const deleteProductByIdHandler = catchErrors(async (req, res, next) => {
  const productId = req.params.productId;
  const createdBy = req.user?._id as string;

  await deleteProductById(productId, createdBy);

  return res
    .status(OK)
    .json({ message: `Product with ID: ${productId} deleted successfully` });
});

// Update a product by ID
export const updateProductByIdHandler = catchErrors(async (req, res, next) => {
  const productId = req.params.productId;
  const createdBy = req.user?._id as string;

  if (req.file) {
    req.body.image = req.file.path;
  }

  const request = updateProductSchema.parse(req.body);
  const product = await updateProductById(productId, request, createdBy);

  return res.status(OK).json(product);
});

export const getPaginatedProductsHandler = catchErrors(
  async (req, res, next) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";
    const createdBy = req.user?._id as string;

    const result = await getPaginatedProducts(page, limit, search, createdBy);

    return res.status(OK).json(result);
  }
);

export const updateStockLevelHandler = catchErrors(async (req, res, next) => {
  const productId = req.params.productId;
  // const { stockQuantity } = req.body;

  const request = updateProductSchema.parse(req.body);

  // Validate stockQuantity
  if (typeof request.stockQuantity !== "number" || request.stockQuantity < 0) {
    return res.status(400).json({ message: "Invalid stock quantity" });
  }

  const updatedProduct = await updateProductStock(
    productId,
    request.stockQuantity
  );

  return res.status(OK).json(updatedProduct);
});
