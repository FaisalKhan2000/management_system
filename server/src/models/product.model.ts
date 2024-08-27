import mongoose, { Schema, Document } from "mongoose";

interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
  image?: string;
  createdBy: string; // ObjectId as string
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stockQuantity: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const ProductModel = mongoose.model<IProduct>("Product", ProductSchema);

export { ProductModel };
