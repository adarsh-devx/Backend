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

// get single product by ID (Public)
export async function getProductById(id) {
  const response = await productApiInstance.get(`/detail/${id}`);
  return response.data;
}

// get single product by ID for seller studio (verified owner only)
export async function getSellerProductById(id) {
  const response = await productApiInstance.get(`/seller/product/${id}`);
  return response.data;
}

// add variant to product
export async function addVariant(productId, variantData) {
  const isFormData = variantData instanceof FormData;
  const response = await productApiInstance.post(
    `/${productId}/variants`,
    variantData,
    {
      headers: isFormData
        ? { "Content-Type": "multipart/form-data" }
        : undefined,
    },
  );
  return response.data;
}

// update variant stock
export async function updateVariantStock(productId, variantId, payload) {
  const response = await productApiInstance.patch(
    `/${productId}/variants/${variantId}/stock`,
    payload,
  );
  return response.data;
}

// delete variant
export async function deleteVariant(productId, variantId) {
  const response = await productApiInstance.delete(
    `/${productId}/variants/${variantId}`,
  );
  return response.data;
}
