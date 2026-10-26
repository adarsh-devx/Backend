import { setError, setUser, setLoading } from "../state/auth.slice.js";
import { register, login, getMe } from "../service/auth.api.js";
import { useDispatch } from "react-redux";

/**
 * Custom React Hook: useAuth
 * Acts as the bridge between UI components (Register/Login forms),
 * the API communication layer (auth.api.js), and global Redux state (auth.slice.js).
 */
export const useAuth = () => {
  const dispatch = useDispatch();

  /**
   * Handles user registration:
   * 1. Calls backend register API
   * 2. On success: Updates Redux store with authenticated user payload
   * 3. On error: Stores error in Redux state & re-throws for local form display
   */
  async function handleRegister({
    email,
    contact,
    password,
    fullName,
    isSeller = false,
  }) {
    try {
      const data = await register({
        email,
        contact,
        password,
        fullName,
        isSeller,
      });
      dispatch(setUser(data.user));
      return data.user;
    } catch (error) {
      dispatch(setError(error.message));
      throw error; // Re-throw so the UI component can handle inline validation errors
    }
  }

  /**
   * Handles user login:
   * 1. Calls backend login API with email & password
   * 2. On success: Dispatches authenticated user data to Redux
   * 3. On error: Dispatches error to Redux & re-throws for local form error display
   */
  async function handleLogin({ email, password }) {
    try {
      const data = await login({ email, password });
      dispatch(setUser(data.user));
      return data.user;
    } catch (error) {
      dispatch(setError(error.message));
      throw error; // Re-throw so Login form can display error message banner
    }
  }

  async function handleGetMe() {
    try {
      dispatch(setLoading(true));
      const data = await getMe();
      dispatch(setUser(data.user));
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }

  return { handleRegister, handleLogin, handleGetMe };
};
