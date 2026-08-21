import { RouterProvider } from "react-router";
import router from "./app.routes";
import './features/shared/styles/global.scss';
import { AuthProvider } from "./features/auth/auth.context";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster position="bottom-right" reverseOrder={false} />
    </AuthProvider>
  );
}

export default App;