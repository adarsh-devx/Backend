import "./App.css";
import { RouterProvider } from "react-router";
import { routes } from "./app.routes.jsx";
import { useAuth } from "@/features/auth/hook/use.auth";
import { useEffect } from "react";

const App = () => {
  const { handleGetMe } = useAuth();

  useEffect(() => {
    handleGetMe().catch(() => {
      // Unauthenticated session (guest user) - ignore silently
    });
  }, []);

  return <RouterProvider router={routes} />;
};

export default App;
