import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { orderLimiter } from "../middlewares/rateLimiter.middleware.js";
import {
  validateAddToCart,
  validateUpdateCartItemQuantity,
  validateRemoveCartItem,
} from "../validator/cart.validator.js";
import {
  addToCart,
  getCart,
  updateCartItemQuantity,
  removeCartItem,
  createOrderController,
  verifyOrderController,
  getOrderDetailsController,
} from "../controllers/cart.controller.js";

const router = express.Router();

// @route POST /api/cart/add/:productId/:variantId
// @desc Add item to cart
// @access Private
// @argument productId - ID of the product to add
// @argument variantId - ID of the variant to add (optional)
// @argument quantity - Quantity of the product to add (optional, default: 1 )

router.post(
  "/add/:productId/:variantId",
  authenticateUser,
  validateAddToCart,
  addToCart,
);
router.post("/add/:productId", authenticateUser, validateAddToCart, addToCart);

// @route GET /api/cart
// @desc Get user's cart
// @access Private
router.get("/", authenticateUser, getCart);

// @route PATCH /api/cart/item/:itemId
// @desc Update item quantity in cart
// @access Private
// @argument quantity - New quantity of the item
router.patch(
  "/item/:itemId",
  authenticateUser,
  validateUpdateCartItemQuantity,
  updateCartItemQuantity,
);

// @route DELETE /api/cart/item/:itemId
// @desc Remove item from cart
// @access Private
router.delete(
  "/item/:itemId",
  authenticateUser,
  validateRemoveCartItem,
  removeCartItem,
);

// @route POST /api/cart/payment/create/order
router.post(
  "/payment/create/order",
  orderLimiter,
  authenticateUser,
  createOrderController,
);

// @route POST /api/cart/payment/verify/order
router.post(
  "/payment/verify/order",
  orderLimiter,
  authenticateUser,
  verifyOrderController,
);

// @route GET /api/cart/order/:orderId
router.get("/order/:orderId", authenticateUser, getOrderDetailsController);

export default router;
