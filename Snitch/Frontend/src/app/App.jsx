import "./App.css";
import "lenis/dist/lenis.css";
import { RouterProvider } from "react-router";
import { routes } from "./app.routes.jsx";
import { useAuth } from "@/features/auth/hook/use.auth";
import { useEffect } from "react";
import Lenis from "lenis";
import AtelierCursor from "@/components/ui/AtelierCursor";
import AtelierScrollIndicator from "@/components/ui/AtelierScrollIndicator";

const App = () => {
  const { handleGetMe } = useAuth();

  useEffect(() => {
    handleGetMe().catch(() => {
      // Unauthenticated session (guest user) - ignore silently
    });

    // Initialize Lenis global smooth scroll with ultra-buttery continuous lerp
    const lenis = new Lenis({
      autoRaf: true,
      smoothWheel: true,
      lerp: 0.05, // Ultra-buttery deep momentum glide
      wheelMultiplier: 0.75, // Cushioned, heavy-weight luxury response
      touchMultiplier: 1.5,
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <AtelierCursor />
      <AtelierScrollIndicator />
      <RouterProvider router={routes} />
    </>
  );
};

export default App;
