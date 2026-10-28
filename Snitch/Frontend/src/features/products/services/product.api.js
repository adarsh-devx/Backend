import axios from "axios";

const productApiInstance = axios.create({
  baseURL: "/api/products",
  withCredentials: true,
});

//create product
export async function createProduct(formData) {
  try {
    const response = await productApiInstance.post("/", formData);
    return response.data;
  } catch (error) {
    throw error;
  }
}

//get seller products
export async function getSellerProduct() {
  try {
    const response = await productApiInstance.get("/seller");
    return response.data;
  } catch (error) {
    throw error;
  }
}

//get all products
export async function getAllProducts() {
  try {
    const response = await productApiInstance.get("/");
    return response.data;
  } catch (error) {
    throw error;
  }
}

//get single product by ID
export async function getProductById(id) {
  try {
    const response = await productApiInstance.get(`/detail/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
