import {
  createProduct,
  getSellerProduct,
  getAllProducts,
  getProductById,
} from "../services/product.api.js";
import { useDispatch } from "react-redux";
import { setSellerProducts, setProducts } from "../state/product.slice.js";

export const useProduct = () => {
  const dispatch = useDispatch();
  const handleCreateProduct = async (formData) => {
    try {
      const data = await createProduct(formData);
      return data.product;
    } catch (error) {
      throw error;
    }
  };

  const handleGetSellerProduct = async () => {
    try {
      const data = await getSellerProduct();
      dispatch(setSellerProducts(data.products));
      return data.products;
    } catch (error) {
      throw error;
    }
  };

  const handleGetAllProducts = async () => {
    try {
      const data = await getAllProducts();
      dispatch(setProducts(data.products));
      return data.products;
    } catch (error) {
      throw error;
    }
  };

  const handleGetProductById = async (id) => {
    try {
      const data = await getProductById(id);
      return data.product;
    } catch (error) {
      throw error;
    }
  };

  return {
    handleCreateProduct,
    handleGetSellerProduct,
    handleGetAllProducts,
    handleGetProductById,
  };
};
