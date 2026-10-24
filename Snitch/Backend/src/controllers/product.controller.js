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
    const amount = Number(priceAmount ?? req.body.price?.amount ?? req.body.price);
    const currency = priceCurrency || req.body.price?.currency || req.body.currency || "INR";

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
  try {
    const products = await productModel
      .find({ seller: req.user._id })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get Seller Products Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
