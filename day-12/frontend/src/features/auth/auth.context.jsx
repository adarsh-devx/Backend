import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { loginApi, getMeApi, registerApi } from "./services/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (username, password) => {
    setLoading(true);
    try {
      const res = await loginApi(username, password);
      setUser(res.user);
      return res; // ✅ Return response
    } catch (err) {
      console.error(err);
      throw err;  // ✅ Throw error so component catch can capture it
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (username, email, password) => {
    setLoading(true);
    try {
      const res = await registerApi(username, email, password);
      setUser(res.user);
      return res; // ✅ Return response
    } catch (err) {
      console.error(err);
      throw err;  // ✅ Throw error
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user,  loading, handleLogin, handleRegister }}
    >
      {children}
    </AuthContext.Provider>
  );
};
