import { Outlet } from "react-router";
import Nav from "../features/Shared/Components/Nav";
import CartDrawer from "../features/cart/components/CartDrawer";

export default function AppLayout() {
  return (
    <>
      <Nav />
      <Outlet />
      <CartDrawer />
    </>
  );
}
