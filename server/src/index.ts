import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { APP_ORIGIN, NODE_ENV, PORT } from "./constants/env";
import connectToDatabase from "./config/db";
import authRoutes from "./routes/auth.route";
import errorHandler from "./middlewares/errorHandler";
import { authenticate, authorize } from "./middlewares/authMiddleware";
import productRoutes from "./routes/product.route";
import adminRoutes from "./routes/admin.route";

const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(
  cors({
    origin: APP_ORIGIN, // Replace with your frontend URL
    credentials: true,
  })
);
app.use(cookieParser());

app.get("/health", authenticate, authorize(["user", "admin"]), (req, res) => {
  res.status(200).json({
    status: "healthy",
  });
});

// auth routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`server is running on ${PORT} in ${NODE_ENV} environment.`);

  await connectToDatabase();
});
