import axios from "axios";

const cartAPIInstance = axios.create({
  baseURL: "/api/cart",
  withCredentials: true,
});

export const addItem = async ({ productId, variantId, quantity = 1 }) => {
  const url = variantId
    ? `/add/${productId}/${variantId}`
    : `/add/${productId}`;

  const response = await cartAPIInstance.post(url, {
    quantity,
  });
  return response.data;
};

export const fetchCart = async () => {
  const response = await cartAPIInstance.get("/");
  return response.data;
};
