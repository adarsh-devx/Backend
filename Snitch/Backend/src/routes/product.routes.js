import express from "express";
import { authenticateSeller } from "../middlewares/auth.middleware.js";
import {
  createProduct,
  getAllProducts,
  getProductById,
  getSellerProducts,
  getSellerProductById,
  addVariantToProduct,
  updateVariantStock,
  deleteVariant,
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

// GET /api/products/seller/product/:id - Only the verified product owner can view it in the seller atelier
router.get("/seller/product/:id", authenticateSeller, getSellerProductById);

// GET /api/products - Get all products (Public)
router.get("/", getAllProducts);

// GET /api/products/:id - Get single product details by ID (Public)
router.get("/detail/:id", getProductById);

// POST /api/products/:id/variants - Add a variant to a product (Seller only)
router.post(
  "/:id/variants",
  authenticateSeller,
  upload.array("images", 6),
  addVariantToProduct,
);

// PATCH /api/products/:id/variants/:variantId/stock - Update variant stock (Seller only)
router.patch(
  "/:id/variants/:variantId/stock",
  authenticateSeller,
  updateVariantStock,
);

// DELETE /api/products/:id/variants/:variantId - Delete a variant (Seller only)
router.delete("/:id/variants/:variantId", authenticateSeller, deleteVariant);

export default router;
