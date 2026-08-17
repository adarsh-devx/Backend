import { useEffect, useState, useMemo } from "react";
import { loginApi, registerApi, getMeApi } from "./services/auth.api";
import { AuthContext } from "./context";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false); // kya check ho chuka?

  // App load hote hi check karo: user logged in hai ya nahi?
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await getMeApi();
        setUser(res.user);
      } catch (err) {
        setUser(null); // not logged in
      } finally {
        setAuthChecked(true); // check complete
      }
    };
    checkAuth();
  }, []);

  const handleLogin = async (username, password) => {
    setLoading(true);
    try {
      const res = await loginApi(username, password);
      setUser(res.user);
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (username, email, password) => {
    setLoading(true);
    try {
      const res = await registerApi(username, email, password);
      setUser(res.user);
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const contextValue = useMemo(
    () => ({ user, loading, authChecked, handleLogin, handleRegister }),
    [user, loading, authChecked]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
