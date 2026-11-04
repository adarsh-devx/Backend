import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { stockOfVariant } from "../dao/product.dao.js";
import { createOrder } from "../services/payment.service.js";
import paymentModel from "../models/payment.model.js";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";
import { config } from "../config/config.js";

async function getCartDetails(userId) {
  let cart = await cartModel
    .findOne({ user: userId })
    .populate("items.product");

  if (!cart) {
    cart = await cartModel.create({ user: userId, items: [] });
    return {
      cart,
      priceAlerts: [],
      totalCartAmount: 0,
    };
  }

  const priceAlerts = [];
  let hasAnyPriceChanged = false;
  let totalCartAmount = 0;

  for (const item of cart.items) {
    const product = item.product;
    if (!product) continue;

    const variant = item.variant
      ? product.variants?.find(
          (v) => v._id.toString() === item.variant.toString(),
        )
      : null;

    const currentPriceObj =
      variant?.price?.amount && Number(variant.price.amount) > 0
        ? variant.price
        : product.price;

    if (!currentPriceObj || typeof currentPriceObj.amount !== "number")
      continue;

    const oldAmount = Number(item.price?.amount || 0);
    const currentAmount = Number(currentPriceObj.amount);

    if (oldAmount > 0 && oldAmount !== currentAmount) {
      hasAnyPriceChanged = true;
      const diff = currentAmount - oldAmount;

      priceAlerts.push({
        type: diff > 0 ? "PRICE_INCREASED" : "PRICE_DECREASED",
        productId: product._id,
        variantId: item.variant || null,
        productTitle: product.title,
        currency: currentPriceObj.currency || "INR",
        oldPrice: oldAmount,
        newPrice: currentAmount,
        difference: Math.abs(diff),
        message:
          diff > 0
            ? `The price of "${product.title}" increased from ₹${oldAmount} to ₹${currentAmount}.`
            : `The price of "${product.title}" dropped from ₹${oldAmount} to ₹${currentAmount}.`,
      });

      // Update cart item price to the new live price
      item.price.amount = currentAmount;
      if (currentPriceObj.currency) {
        item.price.currency = currentPriceObj.currency;
      }
    }

    totalCartAmount += currentAmount * (item.quantity || 1);
  }

  if (hasAnyPriceChanged) {
    await cart.save();
  }

  return {
    cart,
    priceAlerts,
    totalCartAmount,
  };
}

export const addToCart = async (req, res) => {
  try {
    const { productId, variantId } = req.params;
    const { quantity = 1 } = req.body;

    const query = variantId
      ? { _id: productId, "variants._id": variantId }
      : { _id: productId };

    const product = await productModel.findOne(query);

    if (!product) {
      return res.status(404).json({
        message: "Product or variant not found",
        success: false,
      });
    }

    const stock = await stockOfVariant(productId, variantId);

    const variant = variantId
      ? product.variants?.find((v) => v._id.toString() === String(variantId))
      : null;

    const itemPrice =
      variant?.price?.amount && Number(variant.price.amount) > 0
        ? variant.price
        : product.price;

    let cart = await cartModel.findOne({ user: req.user._id });
    if (!cart) {
      cart = await cartModel.create({ user: req.user._id, items: [] });
    }

    const isProductAlreadyInCart = cart.items.some(
      (item) =>
        item.product.toString() === String(productId) &&
        (variantId
          ? item.variant?.toString() === String(variantId)
          : !item.variant),
    );

    if (isProductAlreadyInCart) {
      const existingItem = cart.items.find(
        (item) =>
          item.product.toString() === String(productId) &&
          (variantId
            ? item.variant?.toString() === String(variantId)
            : !item.variant),
      );

      const quantityInCart = existingItem?.quantity || 0;

      if (quantityInCart + quantity > stock) {
        return res.status(400).json({
          message: "You cannot add more quantity than available stock",
          success: false,
        });
      }

      const updateQuery = {
        user: req.user._id,
        "items.product": productId,
      };
      if (variantId) {
        updateQuery["items.variant"] = variantId;
      }

      const updatedCart = await cartModel
        .findOneAndUpdate(
          updateQuery,
          { $inc: { "items.$.quantity": quantity } },
          { new: true },
        )
        .populate("items.product");

      const updatedItem = updatedCart?.items.find(
        (item) =>
          item.product?._id?.toString() === String(productId) &&
          (variantId
            ? item.variant?.toString() === String(variantId)
            : !item.variant),
      );

      return res.status(200).json({
        message: "Cart updated successfully",
        success: true,
        item: updatedItem,
        cart: updatedCart,
      });
    }

    if (quantity > stock) {
      return res.status(400).json({
        message: "You cannot add more quantity than available stock",
        success: false,
      });
    }

    const newItem = {
      product: productId,
      quantity,
      price: itemPrice,
    };
    if (variantId) {
      newItem.variant = variantId;
    }

    cart.items.push(newItem);
    await cart.save();
    await cart.populate("items.product");

    const addedItem = cart.items[cart.items.length - 1];

    return res.status(200).json({
      message: "Product added to cart successfully",
      success: true,
      item: addedItem,
      cart,
    });
  } catch (error) {
    console.error("addToCart error:", error);
    return res.status(500).json({
      message: error.message || "Internal server error while adding to cart",
      success: false,
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const { cart, priceAlerts, totalCartAmount } = await getCartDetails(
      req.user._id,
    );

    return res.status(200).json({
      message: "Cart fetched successfully",
      success: true,
      cart,
      priceAlerts,
      totalCartAmount,
    });
  } catch (error) {
    console.error("getCart error:", error);
    return res.status(500).json({
      message: error.message || "Internal server error while fetching cart",
      success: false,
    });
  }
};

export const updateCartItemQuantity = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    let cart = await cartModel.findOne({ user: req.user._id });
    if (!cart) {
      return res
        .status(404)
        .json({ message: "Cart not found", success: false });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res
        .status(404)
        .json({ message: "Item not found in cart", success: false });
    }

    if (quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be at least 1",
        success: false,
      });
    }

    const stock = await stockOfVariant(item.product, item.variant);

    if (quantity > stock) {
      return res.status(400).json({
        message: `Only ${stock} items left in stock`,
        success: false,
      });
    }

    item.quantity = quantity;

    await cart.save();
    await cart.populate("items.product");

    return res.status(200).json({
      message: "Cart updated successfully",
      success: true,
      cart,
    });
  } catch (error) {
    console.error("updateCartItemQuantity error:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
    });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    let cart = await cartModel.findOne({ user: req.user._id });
    if (!cart) {
      return res
        .status(404)
        .json({ message: "Cart not found", success: false });
    }

    cart.items.pull(itemId);
    await cart.save();
    await cart.populate("items.product");

    return res.status(200).json({
      message: "Item removed from cart",
      success: true,
      cart,
    });
  } catch (error) {
    console.error("removeCartItem error:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
    });
  }
};

export const createOrderController = async (req, res) => {
  try {
    const { cart, totalCartAmount } = await getCartDetails(req.user._id);

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
        success: false,
      });
    }

    if (!totalCartAmount || totalCartAmount <= 0) {
      return res.status(400).json({
        message: "Invalid cart amount",
        success: false,
      });
    }

    const order = await createOrder({
      amount: totalCartAmount,
      currency: "INR",
    });

    const payment = await paymentModel.create({
      user: req.user._id,
      status: "PENDING",
      price: {
        amount: totalCartAmount,
        currency: "INR",
      },
      Razorpay: {
        orderId: order.id,
      },
      orderItems: cart.items.map((item) => {
        const variant = item.variant
          ? item.product?.variants?.find(
              (v) => v._id.toString() === item.variant.toString(),
            )
          : null;

        return {
          title: item.product?.title,
          productId: item.product?._id,
          variantId: item.variant || null,
          quantity: item.quantity,
          images: variant?.images?.length
            ? variant.images
            : item.product?.images,
          description: item.product?.description,
          price: item.price,
        };
      }),
    });

    return res.status(200).json({
      message: "Order created successfully",
      success: true,
      order,
    });
  } catch (error) {
    console.error("createOrderController error:", error);
    return res.status(500).json({
      message: error.message || "Internal server error while creating order",
      success: false,
    });
  }
};

export const verifyOrderController = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const payment = await paymentModel.findOne({
      "Razorpay.orderId": razorpay_order_id,
      status: "PENDING",
    });

    if (!payment) {
      return res.status(400).json({
        message: "Payment not found",
        success: false,
      });
    }

    const isPaymentValid = validatePaymentVerification(
      {
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
      },
      razorpay_signature,
      config.RAZORPAY_KEY_SECRET,
    );

    if (!isPaymentValid) {
      payment.status = "FAILED";
      await payment.save();

      return res.status(400).json({
        message: "Payment verification failed",
        success: false,
      });
    }

    payment.status = "SUCCESS";
    payment.Razorpay.paymentId = razorpay_payment_id;
    payment.Razorpay.signature = razorpay_signature;

    await payment.save();

    // Clear cart after successful payment
    await cartModel.findOneAndUpdate({ user: req.user._id }, { items: [] });

    return res.status(200).json({
      message: "Payment verified successfully",
      success: true,
      payment,
    });
  } catch (error) {
    console.error("verifyOrderController error:", error);
    return res.status(500).json({
      message: error.message || "Internal server error while verifying order",
      success: false,
    });
  }
};
