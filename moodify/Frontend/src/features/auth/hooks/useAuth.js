import {
  registerApi,
  loginApi,
  getmeApi,
  logoutApi,
} from "../services/auth.api";
import { useContext } from "react";
import { AuthContext } from "../auth.context";

export const useAuth = () => {
  const { user, setUser, loading, setLoading } = useContext(AuthContext);

  const handleRegister = async ({ email, username, password }) => {
    try {
      setLoading(true);
      const res = await registerApi({ email, username, password });
      setUser(res.user);
      return res;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async ({ email, username, password }) => {
    try {
      setLoading(true);
      const res = await loginApi({ email, username, password });
      setUser(res.user);
      return res;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleGetme = async () => {
    try {
      const res = await getmeApi();
      setUser(res.user);
      setLoading(false);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      const res = await logoutApi();
      setUser(null);
      return res;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    setUser,
    loading,
    setLoading,
    handleRegister,
    handleLogin,
    handleGetme,
    handleLogout,
  };
};
