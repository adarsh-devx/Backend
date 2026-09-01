import { useDispatch } from "react-redux";
import { register, login, getMe } from "../services/auth.api";
import { setUser, setError, setLoading } from "../auth.slice";
import toast from "react-hot-toast";

export function useAuth() {
  const dispatch = useDispatch();

  async function handleRegister({ email, username, password }) {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const res = await register({ email, username, password });
      toast.success("Account registered! Please check your email to verify.", {
        duration: 5000,
      });
      return res;
    } catch (error) {
      const errMsg = error.response?.data?.message || "Registration failed";
      dispatch(setError(errMsg));
      toast.error(errMsg);
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleLogin({ email, password }) {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const res = await login({ email, password });
      dispatch(setUser(res.user));
      toast.success(`Welcome back, ${res.user.username || "User"}! 🎉`);
      return res;
    } catch (error) {
      const errMsg = error.response?.data?.message || "Login failed";
      dispatch(setError(errMsg));
      toast.error(errMsg);
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetMe() {
    dispatch(setLoading(true));
    try {
      const res = await getMe();
      dispatch(setUser(res.user));
      return res.user;
    } catch (error) {
      // Unauthenticated on initial load is expected when not logged in
      dispatch(setUser(null));
    } finally {
      dispatch(setLoading(false));
    }
  }

  return {
    handleRegister,
    handleLogin,
    handleGetMe,
    dispatch,
  };
}