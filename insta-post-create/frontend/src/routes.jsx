import { createBrowserRouter } from "react-router";
import Register from "./features/auth/pages/Register";
import Login from "./features/auth/pages/Login";
import Feed from "./features/post/pages/Feed";
import ProtectedRoute from "./features/auth/components/ProtectedRoute";
import CreatePost from "./features/post/pages/CreatePost";

const ErrorElement = () => (
  <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "#121212", color: "whitesmoke", fontFamily: "sans-serif" }}>
    <h1 style={{ color: "#f60052", fontSize: "1.8rem", marginBottom: "1rem" }}>Oops!</h1>
    <p>Something went wrong. Please reload the page.</p>
  </main>
);

export const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Feed />
      </ProtectedRoute>
    ),
    errorElement: <ErrorElement />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorElement />,
  },
  {
    path: "/register",
    element: <Register />,
    errorElement: <ErrorElement />,
  },
  {
    path: "/create-post",
    element: <CreatePost />,
    errorElement: <ErrorElement />,
  }
]);