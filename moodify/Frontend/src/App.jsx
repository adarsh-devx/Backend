import { RouterProvider } from "react-router";
import router from "./app.routes";
import './features/shared/styles/global.scss';
import { AuthProvider } from "./features/auth/auth.context";
import { Toaster } from "react-hot-toast";
import { SongContextProvider } from "./features/home/song.context";

function App() {
  return (
    <AuthProvider>
      <SongContextProvider>
      <RouterProvider router={router} />
      </SongContextProvider>
      <Toaster position="bottom-right" reverseOrder={false} />
    </AuthProvider>
  );
}

export default App;