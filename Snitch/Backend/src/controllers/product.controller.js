import mongoose from "mongoose";
import productModel from "../models/product.model.js";
import { uploadToImageKit } from "../services/storage.service.js";

/**
 * Controller: Create Product (Seller only)
 * Handles both file uploads via Multer (multipart/form-data)
 * and direct image URLs via JSON.
 */
export async function createProduct(req, res) {
  try {
    const { title, description, priceAmount, priceCurrency } = req.body;
    const seller = req.user._id;

    // Process uploaded files if multipart/form-data was used
    let images = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        uploadToImageKit(file.buffer, file.originalname, "/snitch/products"),
      );
      const uploadedResults = await Promise.all(uploadPromises);
      images = uploadedResults.map((result) => ({ url: result.url }));
    } else if (req.body.images) {
      // Direct URLs fallback
      images = Array.isArray(req.body.images)
        ? req.body.images.map((item) =>
            typeof item === "string" ? { url: item } : item,
          )
        : [{ url: req.body.images }];
    }

    // Format price object matching product schema ({ amount, currency }) with flexible fallbacks
    const amount = Number(
      priceAmount ?? req.body.price?.amount ?? req.body.price,
    );
    const currency =
      priceCurrency || req.body.price?.currency || req.body.currency || "INR";

    const formattedPrice = {
      amount,
      currency,
    };

    // Create product in database with seller reference
    const product = await productModel.create({
      title,
      description,
      price: formattedPrice,
      images,
      seller,
    });

    return res.status(201).json({
      message: "Product created successfully",
      success: true,
      product,
    });
  } catch (error) {
    console.error("Product Creation Error:", error);
    return res.status(500).json({
      message: error?.message || "Internal server error",
    });
  }
}

/**
 * Controller: Get Seller's Own Products
 * Returns only products where seller matches req.user._id
 */
export async function getSellerProducts(req, res) {
  const seller = req.user;
  try {
    const products = await productModel
      .find({ seller: seller._id })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Products fetched successfully",
      success: true,
      products,
    });
  } catch (error) {
    console.error("Get Seller Products Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * Controller: Get All Products
 * Returns all products with seller details population
 */
export async function getAllProducts(req, res) {
  try {
    const products = await productModel.find();

    return res.status(200).json({
      message: "Products fetched successfully",
      success: true,
      products,
    });
  } catch (error) {
    console.error("Get All Products Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * Controller: Get Single Product By ID
 * Returns full product details with seller info
 */
export async function getProductById(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ message: "Invalid product ID format", success: false });
    }

    const product = await productModel
      .findById(id)
      .populate("seller", "fullName email");

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found", success: false });
    }

    return res.status(200).json({
      message: "Product fetched successfully",
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get Product By ID Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * Controller: Get Single Product By ID for Seller Studio (Seller only)
 * Strictly verifies that the requesting seller is the verified owner.
 * Returns 403 Forbidden if another seller tries to inspect or access it.
 */
export async function getSellerProductById(req, res) {
  try {
    const { id } = req.params;
    const sellerId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ message: "Invalid product ID format", success: false });
    }

    const product = await productModel
      .findById(id)
      .populate("seller", "fullName email");

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found", success: false });
    }

    const productSellerId = product.seller?._id
      ? product.seller._id.toString()
      : product.seller.toString();

    if (productSellerId !== sellerId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not own this product in the seller studio.",
      });
    }

    return res.status(200).json({
      message: "Seller product details fetched successfully",
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get Seller Product By ID Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * Controller: Add Variant to Product (Seller only)
 */
export async function addVariantToProduct(req, res) {
  try {
    const { id } = req.params;
    const sellerId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product ID format" });
    }

    const product = await productModel.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (product.seller.toString() !== sellerId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized. You do not own this product.",
      });
    }

    // Process images if uploaded via Multer or sent as URLs
    let images = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        uploadToImageKit(file.buffer, file.originalname, "/snitch/variants"),
      );
      const uploadedResults = await Promise.all(uploadPromises);
      images = uploadedResults.map((result) => ({ url: result.url }));
    } else if (req.body.images) {
      const raw = Array.isArray(req.body.images)
        ? req.body.images
        : [req.body.images];
      images = raw
        .map((item) => (typeof item === "string" ? { url: item } : item))
        .filter((img) => img?.url);
    }

    // If no variant images provided, fallback to master product first image
    if (images.length === 0 && product.images && product.images.length > 0) {
      images = [{ url: product.images[0].url }];
    }

    // Parse and sanitize attributes (prevent prototype pollution & DOS payloads)
    let attributes = {};
    if (req.body.attributes) {
      try {
        const parsed =
          typeof req.body.attributes === "string"
            ? JSON.parse(req.body.attributes)
            : req.body.attributes;

        if (
          typeof parsed === "object" &&
          parsed !== null &&
          !Array.isArray(parsed)
        ) {
          const dangerousKeys = new Set([
            "__proto__",
            "constructor",
            "prototype",
          ]);
          let count = 0;
          for (const [key, val] of Object.entries(parsed)) {
            if (count >= 20) break; // max 20 custom attributes
            const cleanKey = String(key).trim();
            if (!cleanKey || dangerousKeys.has(cleanKey)) continue;
            attributes[cleanKey] = String(val).slice(0, 200); // max 200 chars per value
            count++;
          }
        }
      } catch (err) {
        attributes = {};
      }
    }

    // Parse price with fallback to master product price & bounded values
    const rawAmount = Number(
      req.body.priceAmount ??
        req.body.price?.amount ??
        product.price?.amount ??
        0,
    );
    const amount = Math.max(
      0,
      Math.min(10000000, Number.isFinite(rawAmount) ? rawAmount : 0),
    );

    const currency =
      req.body.priceCurrency ||
      req.body.price?.currency ||
      product.price?.currency ||
      "INR";

    const stock = Math.max(
      0,
      Math.min(1000000, Math.floor(Number(req.body.stock) || 0)),
    );

    const newVariant = {
      images,
      stock,
      attributes,
      price: {
        amount,
        currency,
      },
    };

    product.variants.push(newVariant);
    await product.save();

    return res.status(201).json({
      success: true,
      message: "Variant crafted successfully",
      product,
      variant: product.variants[product.variants.length - 1],
    });
  } catch (error) {
    console.error("Add Variant Error:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Internal server error",
    });
  }
}

/**
 * Controller: Update Variant Stock (Seller only)
 */
export async function updateVariantStock(req, res) {
  try {
    const { id, variantId } = req.params;
    const sellerId = req.user._id;

    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(variantId)
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Invalid product or variant ID format",
        });
    }

    const product = await productModel.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (product.seller.toString() !== sellerId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const variant = product.variants.id(variantId);
    if (!variant) {
      return res
        .status(404)
        .json({ success: false, message: "Variant not found" });
    }

    if (req.body.stock !== undefined) {
      variant.stock = Math.max(
        0,
        Math.min(1000000, Math.floor(Number(req.body.stock) || 0)),
      );
    } else if (req.body.delta !== undefined) {
      variant.stock = Math.max(
        0,
        Math.min(
          1000000,
          Math.floor((variant.stock || 0) + (Number(req.body.delta) || 0)),
        ),
      );
    }

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Stock adjusted successfully",
      variant,
      product,
    });
  } catch (error) {
    console.error("Update Variant Stock Error:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Internal server error",
    });
  }
}

/**
 * Controller: Delete Variant (Seller only)
 */
export async function deleteVariant(req, res) {
  try {
    const { id, variantId } = req.params;
    const sellerId = req.user._id;

    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(variantId)
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Invalid product or variant ID format",
        });
    }

    const product = await productModel.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (product.seller.toString() !== sellerId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const initialLength = product.variants.length;
    product.variants = product.variants.filter(
      (v) => v._id.toString() !== variantId.toString(),
    );

    if (product.variants.length === initialLength) {
      return res
        .status(404)
        .json({ success: false, message: "Variant not found" });
    }

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Variant eliminated from catalog",
      product,
    });
  } catch (error) {
    console.error("Delete Variant Error:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Internal server error",
    });
  }
}
