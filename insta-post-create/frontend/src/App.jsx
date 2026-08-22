import { RouterProvider } from "react-router";
import { routes } from "./routes";
import "./style.scss";
import { AuthProvider } from "./features/auth/auth.context.jsx";
import { PostContextProvider } from "./features/post/post.context.jsx";

const App = () => {
  return (
    <>
      <AuthProvider>
        <PostContextProvider>
          <RouterProvider router={routes} />
        </PostContextProvider>
      </AuthProvider>
    </>
  );
};

export default App;
