import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export const registerApi = async ({ email, username, password }) => {
  try {
    const response = await api.post("/api/auth/register", { email, username, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginApi = async ({ email, username, password }) => {
  try {
    const response = await api.post("/api/auth/login", { email, username, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getmeApi = async () => {
  try {
    const response = await api.get("/api/auth/get-me");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logoutApi = async () => {
  try {
    const response = await api.get("/api/auth/logout");
    return response.data;
  } catch (error) {
    throw error;
  }
};
