import { createProduct , getSellerProduct } from "../services/product.api.js"
import {useDispatch} from "react-redux"
import { setSellerProducts } from "../state/product.slice.js"


export const useProduct = () => {

    const dispatch = useDispatch();
    const handleCreateProduct = async(formData) => {
        try {
            const data = await createProduct(formData);
            return data.product;
        } catch (error) {
            throw error;
        }
    }

    const handleGetSellerProduct = async() => {
        try {
            const data = await getSellerProduct();
            dispatch(setSellerProducts(data.products));
            return data.products;
        } catch (error) {
            throw error;
        }
    }
    return {
        handleCreateProduct,
        handleGetSellerProduct
    }
}