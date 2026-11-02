import { setError, setUser, setLoading } from "../state/auth.slice.js";
import {
  register,
  login,
  getMe,
  logout,
  updateProfileApi,
  updateAddressesApi,
} from "../service/auth.api.js";
import { useDispatch, useSelector } from "react-redux";

/**
 * Custom React Hook: useAuth
 * Acts as the bridge between UI components (Register/Login forms),
 * the API communication layer (auth.api.js), and global Redux state (auth.slice.js).
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user || null);
  const isLoading = useSelector((state) => state.auth?.loading || false);

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

  async function handleLogout() {
    try {
      await logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      dispatch(setUser(null));
    }
  }

  async function handleUpdateProfile(profileData) {
    const data = await updateProfileApi(profileData);
    if (data.user) {
      dispatch(setUser(data.user));
    }
    return data;
  }

  async function handleUpdateAddresses(addresses) {
    const data = await updateAddressesApi(addresses);
    if (data.user) {
      dispatch(setUser(data.user));
    }
    return data;
  }

  return {
    user,
    isLoading,
    handleRegister,
    handleLogin,
    handleGetMe,
    handleLogout,
    handleUpdateProfile,
    handleUpdateAddresses,
  };
};
