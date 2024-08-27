import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be a positive number"),
  stockQuantity: z.number().nonnegative("Stock quantity must be non-negative"),
  category: z.string().min(1, "Category is required"),
  image: z.string().optional(),
  createdBy: z.string().length(24, "CreatedBy must be a valid ObjectId"),
});

export type TProduct = z.infer<typeof createProductSchema>;

export const updateProductSchema = createProductSchema.partial();
