import productModel from "../models/product.model.js";

export const stockOfVariant = async (productId, variantId) => {
  if (variantId) {
    const product = await productModel.findOne({
      _id: productId,
      "variants._id": variantId,
    });

    const stock = product?.variants?.find(
      (variant) => variant._id.toString() === String(variantId),
    )?.stock;

    return stock ?? 0;
  }

  const product = await productModel.findById(productId);
  return product?.stock ?? 99;
};
