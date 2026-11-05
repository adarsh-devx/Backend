import { Outlet } from "react-router";
import Nav from "@/components/layout/Nav";
import CartDrawer from "../features/cart/components/CartDrawer";
import AtelierCursor from "@/components/ui/AtelierCursor";

export default function AppLayout() {
  return (
    <>
      <AtelierCursor />
      <Nav />
      <Outlet />
      <CartDrawer />
    </>
  );
}
