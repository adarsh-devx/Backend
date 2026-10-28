import express from "express";
import { authenticateSeller } from "../middlewares/auth.middleware.js";
import {
  createProduct,
  getAllProducts,
  getProductById,
  getSellerProducts,
} from "../controllers/product.controller.js";
import { upload } from "../middlewares/upload.middleware.js";
import { createProductValidator } from "../validator/product.validator.js";

const router = express.Router();

// POST /api/products - Only authenticated sellers can create products
router.post(
  "/",
  authenticateSeller,
  upload.array("images", 7),
  createProductValidator,
  createProduct,
);

// GET /api/products/seller - Only authenticated sellers can fetch their own products
router.get("/seller", authenticateSeller, getSellerProducts);

// GET /api/products - Get all products (Public)
router.get("/", getAllProducts);

// GET /api/products/:id - Get single product details by ID (Public)
router.get("/detail/:id", getProductById);

export default router;
