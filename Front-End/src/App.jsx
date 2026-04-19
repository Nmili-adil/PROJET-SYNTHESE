import "./App.css";
import { RouterProvider } from "react-router-dom"; // Importer RouterProvider
import { router } from "./router/Router"; // Importer le router
import AdminContext from "../api/context/AdminContext"; // Contexte d'admin
import { Toaster } from "react-hot-toast";
import ClientContext from "../api/context/ClientContext";
import CartProvider from "../api/context/CartContext";
import ArticleDetails from './components/Partials/ArticleDetails';
import { ThemeProvider } from "./components/theme-provider";

function App() {
  return (
    <AdminContext>
      <ClientContext>
        <CartProvider>
        <Toaster position="bottom-right" />
          <ThemeProvider defaultTheme="dark" storageKey="kc-theme">
        <RouterProvider router={router} />
          </ThemeProvider>
        </CartProvider>
      </ClientContext>
    </AdminContext>
  );
}

export default App;
