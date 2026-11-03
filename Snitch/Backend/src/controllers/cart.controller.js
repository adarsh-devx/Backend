import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { stockOfVariant } from "../dao/product.dao.js";

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
    let cart = await cartModel
      .findOne({ user: req.user._id })
      .populate("items.product");

    if (!cart) {
      cart = await cartModel.create({ user: req.user._id, items: [] });
      return res.status(200).json({
        message: "Cart fetched successfully",
        success: true,
        cart,
        priceAlerts: [],
      });
    }

    const priceAlerts = [];
    let hasAnyPriceChanged = false;

    for (const item of cart.items) {
      const product = item.product;
      if (!product) continue;

      const variant = item.variant
        ? product.variants?.find((v) => v._id.toString() === item.variant.toString())
        : null;

      const currentPriceObj =
        variant?.price?.amount && Number(variant.price.amount) > 0
          ? variant.price
          : product.price;

      if (!currentPriceObj || typeof currentPriceObj.amount !== "number") continue;

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
    }

    if (hasAnyPriceChanged) {
      await cart.save();
    }

    return res.status(200).json({
      message: "Cart fetched successfully",
      success: true,
      cart,
      priceAlerts,
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
