import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import Protected from "../features/auth/components/Protected.jsx";
import Home from "../features/products/pages/Home.jsx";

const Register = lazy(() => import("../features/auth/pages/Register.jsx"));
const Login = lazy(() => import("../features/auth/pages/Login.jsx"));
const CreateProduct = lazy(() => import("../features/products/pages/CreateProduct.jsx"));
const Dashboard = lazy(() => import("@/features/products/pages/Dashboard.jsx"));
const ProductDetail = lazy(() => import("../features/products/pages/ProductDetail.jsx"));

const withSuspense = (Component) => (
  <Suspense fallback={<div className="min-h-screen bg-[#e7e7e0]" />}>
    <Component />
  </Suspense>
);

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/products/:id",
    element: withSuspense(ProductDetail),
  },
  {
    path: "/register",
    element: withSuspense(Register),
  },
  {
    path: "/login",
    element: withSuspense(Login),
  },
  {
    path: "/seller",
    children: [
      {
        path: "create-product",
        element: (
          <Protected role="seller">
            {withSuspense(CreateProduct)}
          </Protected>
        ),
      },
      {
        path: "dashboard",
        element: (
          <Protected role="seller">
            {withSuspense(Dashboard)}
          </Protected>
        ),
      },
    ],
  },
]);
