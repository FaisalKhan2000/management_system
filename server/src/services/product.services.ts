import { NOT_FOUND } from "../constants/http";
import { TProduct } from "../controllers/product.schemas";
import { ProductModel } from "../models/product.model";
import appAssert from "../utils/appAssert";

// Create a new product
export const createProduct = async (data: TProduct) => {
  return ProductModel.create(data);
};

// Get all products created by a specific user
export const getAllProducts = async (createdBy: string) => {
  const products = await ProductModel.find({ createdBy }).exec();
  appAssert(products.length > 0, NOT_FOUND, "No products found");
  return products;
};

// Get a product by ID and createdBy
export const getProductById = async (id: string, createdBy: string) => {
  const product = await ProductModel.find({ _id: id, createdBy }).exec();
  appAssert(product, NOT_FOUND, "Product not found or not owned by user");
  return product;
};

// Delete a product by ID and createdBy
export const deleteProductById = async (id: string, createdBy: string) => {
  const product = await ProductModel.find({ _id: id, createdBy }).exec();
  appAssert(product, NOT_FOUND, "Product not found or not owned by user");

  await ProductModel.deleteOne({ _id: id }).exec();

  return product;
};

// Update a product by ID
export const updateProductById = async (
  id: string,
  updateData: Partial<TProduct>,
  createdBy: string
) => {
  // Find the product by ID and check if it matches the createdBy field
  const product = await ProductModel.findOne({ _id: id, createdBy }).exec();

  if (!product) {
    throw new Error("Product not found or not owned by user");
  }

  // Update the product with the provided data
  const updatedProduct = await ProductModel.findByIdAndUpdate(id, updateData, {
    new: true,
  }).exec();

  if (!updatedProduct) {
    throw new Error("Product not found or not owned by user");
  }

  return updatedProduct;
};

export const getPaginatedProducts = async (
  page: number = 1,
  limit: number = 10,
  search: string = "",
  createdBy: string
) => {
  const skip = (page - 1) * limit;

  // Build query object with search and createdBy
  const query = {
    createdBy,
    ...(search ? { name: new RegExp(search, "i") } : {}),
  };

  const products = await ProductModel.find(query)
    .skip(skip)
    .limit(limit)
    .exec();

  const totalProducts = await ProductModel.countDocuments(query).exec();

  return {
    products,
    totalProducts,
    totalPages: Math.ceil(totalProducts / limit),
    currentPage: page,
  };
};

// Update product stock quantity
export const updateProductStock = async (id: string, stockQuantity: number) => {
  const product = await ProductModel.findById(id);
  appAssert(product, NOT_FOUND, "Product not found");

  product.stockQuantity = stockQuantity;
  await product.save();

  return product;
};
