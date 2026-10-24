import express from "express";
import { authenticateSeller } from "../middlewares/auth.middleware.js";
import { createProduct, getSellerProducts } from "../controllers/product.controller.js";
import { upload } from "../middlewares/upload.middleware.js";
import { createProductValidator } from "../validator/product.validator.js";

const router = express.Router();

// POST /api/products - Only authenticated sellers can create products (supports up to 5 image uploads)
router.post("/", authenticateSeller, createProductValidator, upload.array("images", 7), createProduct);

// GET /api/products/seller - Only authenticated sellers can fetch their own products
router.get("/seller", authenticateSeller, getSellerProducts);

export default router;
