import axios from "axios";

const authApiInstance = axios.create({
  baseURL: "http://localhost:3000/api/auth",
  withCredentials: true,
});

export async function register({ email, contact, password, fullName, isSeller }) {
  try {
    const response = await authApiInstance.post("/register", {
      email,
      contact,
      password,
      fullName,
      isSeller,
    });
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.errors?.[0]?.msg ||
      error.response?.data?.message ||
      error.message ||
      "Registration failed";
    throw new Error(message);
  }
}

export async function login({ email, password }) {
  try {
    const response = await authApiInstance.post("/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.errors?.[0]?.msg ||
      error.response?.data?.message ||
      error.message ||
      "Login failed";
    throw new Error(message);
  }
}

