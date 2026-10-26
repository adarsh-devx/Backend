import axios from "axios";

/**
 * Dedicated Axios instance for Authentication endpoints.
 * - baseURL: "/api/auth" uses the Vite proxy defined in vite.config.js to seamlessly
 *   forward requests to http://localhost:3000 without CORS restrictions.
 * - withCredentials: true ensures HTTP-only JWT cookies are sent and stored across requests.
 */
const authApiInstance = axios.create({
  baseURL: "/api/auth",
  withCredentials: true,
});

/**
 * Register a new user account.
 * Sends user details to POST /api/auth/register and extracts human-readable error messages.
 */
export async function register({
  email,
  contact,
  password,
  fullName,
  isSeller,
}) {
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
    // Extract express-validator error message, backend custom message, or fallback
    const message =
      error.response?.data?.errors?.[0]?.msg ||
      error.response?.data?.message ||
      error.message ||
      "Registration failed";
    throw new Error(message);
  }
}

/**
 * Authenticate existing user with credentials.
 * Sends email and password to POST /api/auth/login.
 */
export async function login({ email, password }) {
  try {
    const response = await authApiInstance.post("/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    // Extract error message for inline display in the UI form
    const message =
      error.response?.data?.errors?.[0]?.msg ||
      error.response?.data?.message ||
      error.message ||
      "Login failed";
    throw new Error(message);
  }
}

export async function getMe() {
  try {
    const response = await authApiInstance.get("/me");
    return response.data;
  } catch (error) {
    // Extract error message for inline display in the UI form
    const message =
      error.response?.data?.errors?.[0]?.msg ||
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch user";
    throw new Error(message);
  }
}
