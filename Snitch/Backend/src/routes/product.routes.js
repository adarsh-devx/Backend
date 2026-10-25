import express from "express";
import { authenticateSeller } from "../middlewares/auth.middleware.js";
import { createProduct, getSellerProducts } from "../controllers/product.controller.js";
import { upload } from "../middlewares/upload.middleware.js";
import { createProductValidator } from "../validator/product.validator.js";

const router = express.Router();

// POST /api/products - Only authenticated sellers can create products (supports up to 5 image uploads)
// @route POST /api/products
// @desc Create a new product
// @access Private (Seller)

router.post("/", authenticateSeller, upload.array("images", 7), createProductValidator, createProduct);

// GET /api/products/seller - Only authenticated sellers can fetch their own products
// @route GET /api/products/seller
// @desc Get all products of the authenticated seller
// @access Private (Seller)

router.get("/seller", authenticateSeller, getSellerProducts);

export default router;
