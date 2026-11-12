import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate, useLocation } from "react-router";
import Nav from "@/components/layout/Nav";
import CartDrawer from "../features/cart/components/CartDrawer";
import AtelierCursor from "@/components/ui/AtelierCursor";
import { useCart } from "../features/cart/hook/useCart";

export default function AppLayout() {
  const user = useSelector((state) => state.auth?.user);
  const { handleSyncPendingCartItem, getPendingCartItem } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const hasSyncedRef = useRef(false);

  // Auto-sync guest pending cart item when authenticated user session is active (e.g. Google OAuth callback)
  useEffect(() => {
    if (user && !hasSyncedRef.current) {
      const pending = getPendingCartItem();
      if (pending) {
        hasSyncedRef.current = true;
        handleSyncPendingCartItem().then((result) => {
          if (
            result?.returnUrl &&
            location.pathname !== result.returnUrl &&
            (location.pathname === "/" || location.pathname === "/login")
          ) {
            navigate(result.returnUrl, { replace: true });
          }
        });
      }
    }
  }, [user, location.pathname, getPendingCartItem, handleSyncPendingCartItem, navigate]);

  return (
    <>
      <AtelierCursor />
      <Nav />
      <Outlet />
      <CartDrawer />
    </>
  );
}
