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

export const getCart = async () => {
  const response = await cartAPIInstance.get("/", { withCredentials: true });
  return response.data;
};

export const updateQuantity = async ({ itemId, quantity }) => {
  const response = await cartAPIInstance.patch(`/item/${itemId}`, { quantity });
  return response.data;
};

export const removeItem = async (itemId) => {
  const response = await cartAPIInstance.delete(`/item/${itemId}`);
  return response.data;
};


export const createCartOrder = async () => {
  const response = await cartAPIInstance.post(`/payment/create/order`);
  return response.data;
};

export const verifyCartOrder = async ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) => {
  const response = await cartAPIInstance.post(`/payment/verify/order`, {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  });
  return response.data;
};