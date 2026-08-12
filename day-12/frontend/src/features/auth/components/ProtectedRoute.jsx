import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const { user, authChecked } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authChecked && !user) {
      navigate("/login");
    }
  }, [authChecked, user, navigate]);

  // Jab tak backend se check complete nahi hota, tab tak loading screen dikhao
  if (!authChecked) {
    return (
      <main>
        <h1>Loading...</h1>
      </main>
    );
  }

  // Agar user logged in hai toh children (Feed) render karo, warna redirect active hoga
  return user ? children : null;
};

export default ProtectedRoute;
