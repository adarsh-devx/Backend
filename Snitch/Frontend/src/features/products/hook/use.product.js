import {
  createProduct,
  getSellerProduct,
  getAllProducts,
  getProductById,
  getSellerProductById,
  addVariant,
  updateVariantStock,
  deleteVariant,
} from "../services/product.api.js";
import { useDispatch } from "react-redux";
import { setSellerProducts, setProducts } from "../state/product.slice.js";

export const useProduct = () => {
  const dispatch = useDispatch();

  const handleCreateProduct = async (formData) => {
    const data = await createProduct(formData);
    return data.product;
  };

  const handleGetSellerProduct = async () => {
    const data = await getSellerProduct();
    dispatch(setSellerProducts(data.products));
    return data.products;
  };

  const handleGetAllProducts = async () => {
    const data = await getAllProducts();
    dispatch(setProducts(data.products));
    return data.products;
  };

  const handleGetProductById = async (id) => {
    const data = await getProductById(id);
    return data.product;
  };

  const handleGetSellerProductById = async (id) => {
    const data = await getSellerProductById(id);
    return data.product;
  };

  const handleAddVariant = async (productId, variantData) => {
    const data = await addVariant(productId, variantData);
    return data;
  };

  const handleUpdateVariantStock = async (productId, variantId, payload) => {
    const data = await updateVariantStock(productId, variantId, payload);
    return data;
  };

  const handleDeleteVariant = async (productId, variantId) => {
    const data = await deleteVariant(productId, variantId);
    return data;
  };

  return {
    handleCreateProduct,
    handleGetSellerProduct,
    handleGetAllProducts,
    handleGetProductById,
    handleGetSellerProductById,
    handleAddVariant,
    handleUpdateVariantStock,
    handleDeleteVariant,
  };
};
