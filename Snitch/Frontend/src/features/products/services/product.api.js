import axios from "axios";

const productApiInstance = axios.create({
  baseURL: "/api/products",
  withCredentials: true,
});


//create product
export async function createProduct(formData){
    try {
        const response = await productApiInstance.post("/",formData);
        return response.data;
    } catch (error) {
        throw error;
    }
}


//get seller products
export async function getSellerProduct(){
    try {
        const response = await productApiInstance.get("/seller");
        return response.data;
    } catch (error) {
        throw error;
    }
}