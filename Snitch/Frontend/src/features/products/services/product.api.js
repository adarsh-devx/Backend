import axios from "axios";

const productApiInstance = axios.create({
  baseURL: "/api/products",
  withCredentials: true,
});

// create product
export async function createProduct(formData) {
  const response = await productApiInstance.post("/", formData);
  return response.data;
}

// get seller products
export async function getSellerProduct() {
  const response = await productApiInstance.get("/seller");
  return response.data;
}

// get all products
export async function getAllProducts() {
  const response = await productApiInstance.get("/");
  return response.data;
}

// get single product by ID
export async function getProductById(id) {
  const response = await productApiInstance.get(`/detail/${id}`);
  return response.data;
}
